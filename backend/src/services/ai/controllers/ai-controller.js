import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK lazily so dotenv has time to load the environment variables
let ai;
const getAI = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
};

export const getMonthlyInsights = async (req, res) => {
    try {
        // Mocking the user's spending data for May 2026
        const may2026Data = {
            month: "May 2026",
            income: 15000000,
            expenses: {
                "Food Delivery": 1200000,
                "Online Shopping": 3500000,
                "Subscriptions": 500000,
                "Groceries": 2000000,
                "Transport": 800000
            },
            savings: 7000000
        };

        const prompt = `You are a financial advisor for an app called PocketWise/SpendWise. 
Based on the following user's monthly spending data for ${may2026Data.month}:
Income: Rp ${may2026Data.income}
Expenses:
- Food Delivery: Rp ${may2026Data.expenses["Food Delivery"]}
- Online Shopping: Rp ${may2026Data.expenses["Online Shopping"]}
- Subscriptions: Rp ${may2026Data.expenses["Subscriptions"]}
- Groceries: Rp ${may2026Data.expenses["Groceries"]}
- Transport: Rp ${may2026Data.expenses["Transport"]}
Savings: Rp ${may2026Data.savings}

Provide exactly 3 brief, distinct, and actionable monthly insights based heavily on this specific data. Focus on trends like high online shopping or food delivery costs, and commend the savings.
Return the result as a JSON array of strings. Do not use markdown blocks, just raw JSON.`;

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const insightsText = response.text();
        const insights = JSON.parse(insightsText);
        
        return res.status(200).json({ success: true, insights });
    } catch (error) {
        console.error('Error generating insights:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate insights' });
    }
};

export const getNextMonthPrediction = async (req, res) => {
    try {
        // Mocking the Keras Model Prediction because of Python environment issue.
        const mockedPrediction = {
            expectedSpending: 54504,
            confidence: 85,
            topCategories: ["Groceries", "Eating Out", "Transport", "Entertainment"]
        };

        const prompt = `You are a financial advisor AI. The user's expected spending for next month is projected to be Rp ${mockedPrediction.expectedSpending} with a confidence of ${mockedPrediction.confidence}%.
Their top spending categories are projected to be: ${mockedPrediction.topCategories.join(", ")}.

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

        return res.status(200).json({
            success: true,
            prediction: mockedPrediction,
            analysis: geminiData.analysis,
            recommendedActions: geminiData.recommendedActions
        });
    } catch (error) {
        console.error('Error generating prediction analysis:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate prediction' });
    }
};
