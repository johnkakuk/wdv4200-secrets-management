const express = require('express')
const crypto = require('crypto')
const app = express()
const port = 3000

// ---------------------------------------------------------------
// HARD-CODED SECRETS (Part 1)
// These values are written directly into the source code, so anyone
// who can read this file or the repository can see them.
// All of these are fake values made up for this assignment.
// ---------------------------------------------------------------
const API_KEY = 'wdv4200-demo-api-key-8f3a91c2'
const DB_USER = 'app_admin'
const DB_PASSWORD = 'Sup3rS3cretP@ssw0rd!'
const DB_HOST = 'db.example.internal'
const DB_NAME = 'inventory'
const JWT_SECRET = 'hardcoded-signing-secret-do-not-use'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Secret 1: API key check. Only requests that send the right key get data.
// Try: /api/data?key=wdv4200-demo-api-key-8f3a91c2
app.get('/api/data', (req, res) => {
  if (req.query.key !== API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' })
  }
  res.json({ message: 'Access granted', items: ['widget', 'gadget', 'gizmo'] })
})

// Secret 2: database credentials. Builds a mock connection string and
// shows it with the password masked.
app.get('/db', (req, res) => {
  const connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`
  res.json({
    status: 'Mock database connection configured',
    connection: connectionString.replace(DB_PASSWORD, '********')
  })
})

// Secret 3: signing secret. Signs a simple token with HMAC-SHA256.
// Try: /token?user=john
app.get('/token', (req, res) => {
  const user = req.query.user || 'guest'
  const payload = Buffer.from(JSON.stringify({ user, issued: Date.now() })).toString('base64url')
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url')
  res.json({ token: `${payload}.${signature}` })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
