import express from 'express';
import { createServer } from 'http';

export const app = express();
app.use(express.json());
export const http = createServer(app);
