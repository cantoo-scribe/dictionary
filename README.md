# AI Server API Integration Guide

## Security Requirements

### Content Security Policy (CSP)

To allow your website to make requests to your API, you need to add your domain to your Content Security Policy. This can be done in two ways:

1. Using a meta tag in your HTML:
```html
<meta http-equiv="Content-Security-Policy" content="connect-src 'self' protocol://domain;">
```

2. Using HTTP headers in your server configuration:
```
Content-Security-Policy: connect-src 'self' protocol://domain;
```

If you have an existing CSP, simply add `protocol://domain` to your `connect-src` directive.

### CORS and HTTPS

- The API is served over HTTPS only
- CORS is enabled for all origins
- Only POST requests are allowed
- Required headers: `Content-Type`, `X-Signature`, `X-Timestamp`

## API Authentication

All requests must be authenticated using HMAC signatures. For each request, you need to:

1. Generate a timestamp (ISO format)
2. Create a signature using:
   - The request body
   - The timestamp
   - Your client secret

Example request:
```javascript
const timestamp = new Date().toISOString();
const body = JSON.stringify({
  word: "example",
  lang: "english",
  answerLang: "french"
});

const signature = createHmac('sha256', CLIENT_SECRET)
  .update(`${timestamp}:${body}`)
  .digest('hex');

fetch('https://domain/dictionary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Timestamp': timestamp,
    'X-Signature': signature
  },
  body
});
```
