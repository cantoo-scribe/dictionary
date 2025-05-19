/**
 * MIT License
 *
 * Copyright (c) 2025 Cantoo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// @ts-check
const express = require("express")
const dotenv = require('dotenv')
const path  = require("path")
const cors = require('cors')
const helmet = require('helmet').default
const { models } = require('./models')
const verifyHMAC = require('./middleware/hmac')

dotenv.config()
let dictionaryModel
let LlamaChatSessionClass

// Configure CORS to allow all origins but with explicit headers
const corsOptions = {
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Signature', 'X-Timestamp', 'X-Client-Id'],
  exposedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 86400 // CORS preflight cache time in seconds (24 hours)
}

const loadModel = async () => {
  // 'node-llama-cpp' is esm, it means that it can't be loaded with require
  const { getLlama, LlamaChatSession } = await import("node-llama-cpp")
  console.log('loading model:', models.qwen1_5B.repo + '/' + models.qwen1_5B.file)
  const llama = await getLlama()
  dictionaryModel = await llama.loadModel({
    // it's important to run the download script before using the model
    // change the selected model here
    modelPath: path.resolve(process.cwd(), "models", models.qwen1_5B.file),
  })
  console.log('model loaded!')

  LlamaChatSessionClass = LlamaChatSession
}

loadModel()

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3001

const app = express()

// Apply CORS to all routes
app.use(cors(corsOptions))

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}))

// Ensure CORS headers are always set
app.use(/** @type {import('express').RequestHandler} */((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Signature, X-Timestamp, X-Client-Id');
  res.header('Access-Control-Expose-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
}));

app.use(express.json())

// Skip HMAC verification in development
if (process.env.NODE_ENV === 'production') {
  app.use(verifyHMAC)
}

app.post("/dictionary", /** @type {import('express').RequestHandler} */(async (req, res) => {
  const { word, lang, phrase, answerLang = 'french' } = req.body

  if (!dictionaryModel) return res.status(500).json({ message: 'no model loaded' })
  if (!word) return res.status(400).json({ message: 'no word provided' })
  if (!lang) return res.status(400).json({ message: 'no lang provided' })

  let prompt = ''
  if (phrase) prompt = `In the phrase "${phrase}", what the "${word}" means? Answer in ${answerLang}.`
  else prompt = `What is the definition of the ${lang} word "${word}"? Answer in ${answerLang}.`

  const context = await dictionaryModel.createContext({
    contextSize: 2048,
  })
  const session = new LlamaChatSessionClass({
    contextSequence: context.getSequence(),
    systemPrompt: 'You are a highschool teacher that helps students to understand the meaning of words.',
  })

  const promptResult = await session.prompt(prompt, {
    // Select the top 25 most probably tokens to complete the answer
    topK: 25,
    // Instead of a fixed number of tokens like topK, Top-P sampling selects the smallest group of top tokens whose cumulative probability adds up to at least 95%.
    // It's a dynamic cutoff — sometimes more than 25 tokens, sometimes fewer.
    topP: 0.95,
    // limit the size of the answer to 400 words
    maxTokens: 400,
    // the randomness of the answer. Higher value means more randomness. If the value is 0, only the most probably token is selected.
    temperature: 0.7,
    }
  )

  // this is important to free the memory after the request
  await context.dispose()

  res.json({
    result: promptResult
  })
}))

app.listen(PORT, () => console.log("Server running on port", PORT))

// free the memory when the process end
process.on('SIGTERM', () => {
  dictionaryModel && !dictionaryModel.disposed && dictionaryModel.dispose()
})
dictionaryModel