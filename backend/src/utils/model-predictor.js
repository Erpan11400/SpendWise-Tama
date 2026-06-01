import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const predictWithModel = (features) => {
    return new Promise((resolve, reject) => {
        const pythonPath = process.env.PYTHON_PATH || 'python'; // Use env var or default 'python'
        const scriptPath = join(__dirname, '../../../ai-model/predict.py');
        
        const python = spawn(pythonPath, [scriptPath]);
        
        let stdout = '';
        let stderr = '';
        
        python.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        python.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}`);
                console.error(`stderr: ${stderr}`);
                reject(new Error(`Model prediction failed: ${stderr || 'Unknown error'}`));
                return;
            }
            
            try {
                const result = JSON.parse(stdout.trim());
                if (result.success) {
                    resolve(result);
                } else {
                    reject(new Error(result.error || 'Model prediction failed'));
                }
            } catch (e) {
                console.error('Failed to parse Python output:', stdout);
                reject(new Error(`Invalid model response: ${e.message}`));
            }
        });
        
        python.on('error', (err) => {
            reject(new Error(`Failed to spawn Python process: ${err.message}`));
        });
        
        // Send input data to Python script
        try {
            python.stdin.write(JSON.stringify({ features }));
            python.stdin.end();
        } catch (e) {
            reject(new Error(`Failed to send data to Python: ${e.message}`));
        }
    });
};

export default predictWithModel;
