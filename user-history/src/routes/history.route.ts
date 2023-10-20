import express from 'express';
import { getUserHistoryById } from '../controllers/history.controller';
const history = express.Router();

history.get('/history/:userId', getUserHistoryById);

export default history;
