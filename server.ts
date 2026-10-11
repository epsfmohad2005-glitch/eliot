/**
 * @file server.ts
 * @description Full-stack Express + Vite application server for Eliot PLOS.
 * Securely proxies Gemini API requests server-side keeping API keys hidden from client.
 * @license Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const PORT = 3000;
const DEFAULT_MODEL = 'gemini-3.8-flash';

let genAIInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIInstance && process.env.GEMINI_API_KEY) {
    genAIInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIInstance;
}

async function startServer() {
  const app = express();

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // Enable CORS for iframe embedding and cross-origin requests
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (_req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Health and readiness check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Server-side Gemini AI generation proxy (Socratic hints & general guidance)
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const {
        systemPrompt = '',
        userMessage = '',
        contextMemoryItems = [],
        model = DEFAULT_MODEL,
      } = req.body || {};

      const memoryList = Array.isArray(contextMemoryItems)
        ? contextMemoryItems
        : contextMemoryItems
        ? [String(contextMemoryItems)]
        : [];

      const ai = getGenAI();
      if (!ai) {
        return res.status(503).json({
          ok: false,
          error: 'GEMINI_API_KEY is not configured on the server.',
          isFallback: true,
          fallbackData: {
            responseText: `[Socratic Offline Mode]: ${userMessage}\n\nWhat specific mental model assumption underpins your current approach?`,
            isSocraticQuestion: true,
            modelUsed: 'offline-socratic-fallback',
          },
        });
      }

      const promptContext = [
        'SYSTEM INSTRUCTION (IMMUTABLE CONSTITUTION):',
        'You are the Eliot Socratic Tutor. You are STRICTLY FORBIDDEN from generating complete project code or direct answers for the user.',
        'Your absolute duty is to ask diagnostic Socratic questions that guide the user to discover solutions independently.',
        'If memory context is provided, align your question with past mistake patterns.',
        '----------------------------------------',
        memoryList.length > 0 ? `Memory Context:\n${memoryList.join('\n')}` : '',
        `User Query: ${userMessage}`,
      ].filter(Boolean).join('\n');

      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${promptContext}` : promptContext;

      const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
      });

      const responseText = response.text || '';

      // Check against forbidden solution patterns
      const forbiddenPatterns = [
        /here is the complete solution/i,
        /here is the code for your assignment/i,
        /i have written the project for you/i,
        /copy and paste this code/i,
      ];

      for (const pattern of forbiddenPatterns) {
        if (pattern.test(responseText)) {
          return res.status(422).json({
            ok: false,
            error: 'AI generated complete solution, violating Socratic refusal rules.',
          });
        }
      }

      return res.json({
        ok: true,
        data: {
          responseText,
          isSocraticQuestion: true,
          modelUsed: model,
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[server.ts] Gemini API generate error:', message);
      return res.status(500).json({
        ok: false,
        error: message,
      });
    }
  });

  // Server-side Gemini AI rubric / stage challenge evaluation proxy
  app.post('/api/ai/rubric', async (req, res) => {
    try {
      const {
        systemPrompt = '',
        rubricCriteria,
        userMessage = '',
        model = DEFAULT_MODEL,
      } = req.body || {};

      const ai = getGenAI();
      if (!ai) {
        return res.status(503).json({
          ok: false,
          error: 'GEMINI_API_KEY is not configured on the server.',
          isFallback: true,
          fallbackData: {
            responseText: 'Rubric evaluation pending live API key connection.',
            structuredJson: { status: 'PENDING_KEY', approved: false },
            isSocraticQuestion: false,
            modelUsed: 'offline-socratic-fallback',
          },
        });
      }

      const prompt = [
        systemPrompt,
        rubricCriteria ? `Rubric Criteria:\n${JSON.stringify(rubricCriteria, null, 2)}` : '',
        `Submitted Content:\n${userMessage}`,
      ].filter(Boolean).join('\n\n');

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const responseText = response.text || '';

      return res.json({
        ok: true,
        data: {
          responseText,
          isSocraticQuestion: false,
          modelUsed: model,
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[server.ts] Gemini API rubric error:', message);
      return res.status(500).json({
        ok: false,
        error: message,
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
