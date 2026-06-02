import { GoogleGenAI } from '@google/genai';
import db from '../../../database/sqlite.js';
import predictWithModel from '../../../utils/model-predictor.js';

// Initialize Gemini SDK lazily so dotenv has time to load the environment variables
let ai;
const getAI = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
};

const monthMap = {
    'Januari': '01','Februari': '02','Maret': '03','April': '04','Mei': '05','Juni': '06',
    'Juli': '07','Agustus': '08','September': '09','Oktober': '10','November': '11','Desember': '12'
};

export const getMonthlyInsights = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;
        const user = req.user; // set by authenticateToken middleware
        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const mName = bulan || new Date().toLocaleString('id-ID', { month: 'long' });
        const y = tahun || String(new Date().getFullYear());
        const monthNum = monthMap[mName] || (String(Number(mName)).padStart(2,'0'));
        const period = `${y}-${monthNum}`; // YYYY-MM

        // Aggregate income and expenses
        const incomeRow = db.prepare('SELECT IFNULL(SUM(amount),0) AS total FROM transactions WHERE user_id = ? AND type = ? AND substr(date,1,7) = ?').get(user.id, 'Pemasukan', period);
        const expenseRow = db.prepare('SELECT IFNULL(SUM(amount),0) AS total FROM transactions WHERE user_id = ? AND type = ? AND substr(date,1,7) = ?').get(user.id, 'Pengeluaran', period);

        const income = incomeRow ? Number(incomeRow.total) : 0;
        const expensesTotal = expenseRow ? Number(expenseRow.total) : 0;

        const categories = db.prepare('SELECT category, IFNULL(SUM(amount),0) AS total FROM transactions WHERE user_id = ? AND type = ? AND substr(date,1,7) = ? GROUP BY category ORDER BY total DESC').all(user.id, 'Pengeluaran', period);

        const expenses = {};
        categories.forEach(r => {
            expenses[r.category || 'Uncategorized'] = Number(r.total);
        });

        const savings = income - expensesTotal;

        const prompt = `You are a financial advisor for an app called SpendWise.
Based on the user's transactions for ${mName} ${y} (period ${period}):\n` +
            `Income: Rp ${income}\n` +
            `Total Expenses: Rp ${expensesTotal}\n` +
            `Savings: Rp ${savings}\n` +
            `Expenses by category:\n` +
            Object.entries(expenses).map(([k,v]) => `- ${k}: Rp ${v}`).join('\n') +
            `\n\nProvide exactly 3 brief, distinct, and actionable monthly insights based heavily on this specific data. Focus on trends, high categories, and practical actions to save or re-balance budget. Return the result as a JSON array of strings. Do not use markdown blocks, just raw JSON.`;

        // Try calling Gemini; if it fails, fall back to simple rule-based insights
        let insights = null;
        try {
            const response = await getAI().models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });

            const insightsText = response.text();
            insights = JSON.parse(insightsText);
        } catch (e) {
            console.error('Gemini call failed, using fallback insights:', e.message || e);
            // Fallback simple heuristics
            const topCategory = Object.entries(expenses).sort((a,b)=>b[1]-a[1])[0];
            const fallback = [];
            if (expensesTotal === 0 && income === 0) {
                fallback.push('No transactions recorded this month. Try adding your recent expenses to get insights.');
            } else {
                if (topCategory && topCategory[1] > 0 && topCategory[1] / Math.max(expensesTotal,1) > 0.4) {
                    fallback.push(`You've spent a large portion on ${topCategory[0]} (Rp ${topCategory[1]}). Consider setting a limit or reducing frequency.`);
                } else if (expensesTotal > income) {
                    fallback.push('Your expenses exceed your income this month. Review recurring costs and reduce discretionary spending.');
                } else {
                    fallback.push('Spending looks balanced relative to income. Keep tracking to maintain good habits.');
                }

                if (savings > 0) fallback.push(`Good job — you saved Rp ${savings} this month. Consider allocating part to an emergency fund.`);
                else fallback.push('No savings this month — try setting a small weekly saving goal.');
            }
            insights = fallback;
        }

        return res.status(200).json({ success: true, insights, analytics: { income, expensesTotal, savings, categories } });
    } catch (error) {
        console.error('Error generating insights:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate insights' });
    }
};

export const getNextMonthPrediction = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;
        const user = req.user; 
        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Get current/specified month data for feature engineering
        const mName = bulan || new Date().toLocaleString('id-ID', { month: 'long' });
        const y = tahun || String(new Date().getFullYear());
        const monthNum = monthMap[mName] || (String(Number(mName)).padStart(2,'0'));
        const period = `${y}-${monthNum}`;

        // Aggregate current month data
        const incomeRow = db.prepare('SELECT IFNULL(SUM(amount),0) AS total FROM transactions WHERE user_id = ? AND type = ? AND substr(date,1,7) = ?').get(user.id, 'Pemasukan', period);
        const expenseRow = db.prepare('SELECT IFNULL(SUM(amount),0) AS total FROM transactions WHERE user_id = ? AND type = ? AND substr(date,1,7) = ?').get(user.id, 'Pengeluaran', period);

        const income = incomeRow ? Number(incomeRow.total) : 0;
        const expensesTotal = expenseRow ? Number(expenseRow.total) : 0;

        const categories = db.prepare('SELECT category, IFNULL(SUM(amount),0) AS total FROM transactions WHERE user_id = ? AND type = ? AND substr(date,1,7) = ? GROUP BY category ORDER BY total DESC').all(user.id, 'Pengeluaran', period);

        const expenses = {};
        categories.forEach(r => {
            expenses[r.category || 'Uncategorized'] = Number(r.total);
        });

        const savings = income - expensesTotal;

        // Build feature vector for model prediction
        // Features: [income, total_expenses, savings, top_category_1_amount, top_category_2_amount, ...]
        const topCategories = Object.entries(expenses)
            .sort((a,b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cat, amt]) => amt);

        // Pad to 7 features: [income, expenses, savings, cat1, cat2, cat3, cat4]
        const features = [
            income || 0,
            expensesTotal || 0,
            savings || 0,
            topCategories[0] || 0,
            topCategories[1] || 0,
            topCategories[2] || 0,
            topCategories[3] || 0
        ];

        let modelPrediction = null;
        try {
            modelPrediction = await predictWithModel(features);
            console.log('Model prediction:', modelPrediction);
        } catch (e) {
            console.error('Model prediction failed:', e.message);
            // Fallback: simple heuristic
            modelPrediction = {
                success: true,
                prediction: expensesTotal * 1.1, // Assume 10% increase
                confidence: 0.6
            };
        }

        const expectedSpending = modelPrediction.prediction || expensesTotal;
        const confidence = (modelPrediction.confidence || 0.7) * 100;

        // Generate analysis with Gemini or fallback text
        let analysis = '';
        let recommendedActions = [];

        try {
            const prompt = `You are a financial advisor AI. Based on the user's spending patterns, the expected spending for next month is projected to be Rp ${expectedSpending} with a confidence of ${confidence}%.
Their current top spending categories are: ${Object.keys(expenses).slice(0, 3).join(", ")}.

Provide a brief AI Analysis (around 2-3 short paragraphs) summarizing this expected spending and its implications.
Then, provide a list of 3 short Recommended Actions.

Return the result as a raw JSON object with this exact structure:
{
    "analysis": "String containing the AI analysis paragraphs.",
    "recommendedActions": ["action 1", "action 2", "action 3"]
}
Do not use markdown blocks, just raw JSON.`;

            const response = await getAI().models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            const geminiText = response.text();
            const geminiData = JSON.parse(geminiText);
            analysis = geminiData.analysis;
            recommendedActions = geminiData.recommendedActions;
        } catch (e) {
            console.error('Gemini analysis failed:', e.message);
            // Fallback analysis
            analysis = `Based on your spending history, the predicted spending for next month is Rp ${expectedSpending}. 
Your top expense categories have been ${Object.keys(expenses).slice(0, 2).join(" and ")}.
Try to maintain or reduce spending in these categories to stay within budget.`;
            recommendedActions = [
                `Set a monthly budget limit of Rp ${Math.round(expectedSpending * 0.9)}`,
                `Track daily expenses to avoid overspending`,
                `Review and cut unnecessary subscriptions or recurring costs`
            ];
        }

        return res.status(200).json({
            success: true,
            prediction: {
                expectedSpending: Math.round(expectedSpending),
                confidence: Math.round(confidence),
                topCategories: Object.keys(expenses).slice(0, 4)
            },
            analysis,
            recommendedActions
        });
    } catch (error) {
        console.error('Error generating prediction:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate prediction' });
    }
};
