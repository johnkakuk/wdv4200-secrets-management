// ---------------------------------------------------------------
// SHARED SECRETS FILE (Part 2)
// Secrets are no longer in the code. dotenv loads them from the .env
// file into process.env. Here, that .env file is committed to the
// repository, so cloning the repo also gives you every secret.
// ---------------------------------------------------------------
require('dotenv').config({ quiet: true })

const express = require('express')
const crypto = require('crypto')
const app = express()
const port = 3000

const { API_KEY, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, JWT_SECRET } = process.env

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
