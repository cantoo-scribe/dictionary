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
const crypto = require('crypto')

function verifyHMAC(req, res, next) {
  const clientId = req.header('X-Client-Id')
  const signature = req.header('X-Signature')
  const timestamp = req.header('X-Timestamp')

  if (!clientId || !signature || !timestamp) {
    return res.status(401).json({ message: 'Missing HMAC headers' })
  }

  if (!process.env.CLIENT_SECRET) {
    console.error('CLIENT_SECRET environment variable is not set')
    return res.status(500).json({ message: 'Server configuration error' })
  }

  const clientSecret = process.env.CLIENT_SECRET
  const body = JSON.stringify(req.body || {})
  const query = JSON.stringify(req.query || {})

  // Check if timestamp is within reasonable range (±5 min)
  const now = Date.now()
  const sentTime = Date.parse(timestamp)
  if (Math.abs(now - sentTime) > 5 * 60 * 1000) {
    return res.status(401).json({ message: 'Invalid timestamp' })
  }

  // Include both query parameters and body in the HMAC calculation
  const baseString = `${clientId}:${timestamp}:${query}:${body}`
  const expectedSignature = crypto
    .createHmac('sha256', clientSecret)
    .update(baseString)
    .digest('hex')

  if (signature !== expectedSignature) {
    return res.status(401).json({ message: 'Invalid HMAC signature' })
  }

  next()
}

module.exports = verifyHMAC 