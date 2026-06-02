import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

import server from "./server/app-server.js"

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

console.log('Env loaded:', {
    host: Boolean(process.env.HOST),
    port: Boolean(process.env.PORT),
    accessKey: Boolean(process.env.ACCESS_TOKEN_KEY),
    refreshKey: Boolean(process.env.REFRESH_TOKEN_KEY)
})

server.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`)
})