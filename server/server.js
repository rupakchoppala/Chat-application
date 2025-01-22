import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import  db  from './dbconfig.js';
import { app } from './app.js';

const port = process.env.PORT_NUMBER;
if (!port) {
    console.error("Port number not found in environment variables!");
    process.exit(1);
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
