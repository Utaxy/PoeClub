import app from '../app.js';

// Vercel Node.js Serverless Function handler
// Pass the incoming request directly to the Express app
export default function handler(req, res) {
	return app(req, res);
}