import express from 'express';
import bodyParser from 'body-parser';
import os from 'os';
export const app = express();
require('dotenv').config();
import loginRoutes from './api/auth/login';
import registerRoutes from './api/auth/register';
import topicRoutes from './api/topic/topic';
import Database from './controller/database';

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use('/', loginRoutes);
app.use('/', registerRoutes);
app.use('/', topicRoutes);

Database.connect();

app.get('/', async (req: any, res: any) => {
	const result: any = {
		name: 'api-v1-DSA-Sheet-Page',
		version:'v1',
		apiStartedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
		host: os.hostname()
	};
	return res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
