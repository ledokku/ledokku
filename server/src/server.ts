import express from 'express';
import { createServer } from 'http';
import socketIo from 'socket.io';

export const app = express();
export const http = createServer(app);
export const io = socketIo(http);
