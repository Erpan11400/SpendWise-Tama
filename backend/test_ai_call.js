import './src/server/app-server.js';
import { getMonthlyInsights, getNextMonthPrediction } from './src/services/ai/controllers/ai-controller.js';

const mockReq = {
  query: {},
  user: { id: 1 }
};

const mockRes = {
  status(code) { this._status = code; return this; },
  json(obj) { console.log('\n=== RESPONSE ===', this._status); console.log(JSON.stringify(obj, null, 2)); }
};

(async () => {
  try {
    console.log('\n>>> Testing getMonthlyInsights...');
    await getMonthlyInsights(mockReq, mockRes);
    
    console.log('\n>>> Testing getNextMonthPrediction...');
    await getNextMonthPrediction(mockReq, mockRes);
  } catch (e) {
    console.error('EXCEPTION', e);
  }
})();

