import request from 'supertest';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Mock the db module
jest.mock('../db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

import pool from '../db';

// Manually setup the app without starting the server
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

app.get('/logs', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM log ORDER BY inserted_at DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/logs', async (req: Request, res: Response) => {
  try {
    const { jsonData } = req.body;

    if (!jsonData) {
      return res.status(400).json({ error: 'jsonData is required' });
    }

    const { rows } = await pool.query(
      'INSERT INTO log (json) VALUES ($1) RETURNING *',
      [jsonData]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error inserting log:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

describe('GET /', () => {
  it('should return 200 OK with a message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Backend server is running!');
  });
});

describe('GET /logs', () => {
  it('should return 200 OK with an array of logs', async () => {
    const mockLogs = [{ id: 1, json: { message: 'test' }, inserted_at: new Date() }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockLogs });

    const res = await request(app).get('/logs');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockLogs.map(log => ({...log, inserted_at: log.inserted_at.toISOString()})));
  });

  it('should return 500 on database error', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/logs');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });
});

describe('POST /logs', () => {
  it('should return 201 Created with the new log', async () => {
    const newLog = { jsonData: { message: 'new log' } };
    const returnedLog = { id: 2, json: newLog.jsonData, inserted_at: new Date() };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [returnedLog] });

    const res = await request(app).post('/logs').send(newLog);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({...returnedLog, inserted_at: returnedLog.inserted_at.toISOString()});
  });

  it('should return 400 if jsonData is not provided', async () => {
    const res = await request(app).post('/logs').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: 'jsonData is required' });
  });

  it('should return 500 on database error', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('Database error'));

    const res = await request(app).post('/logs').send({ jsonData: { message: 'test' } });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });
});
