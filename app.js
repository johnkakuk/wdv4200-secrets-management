// ---------------------------------------------------------------
// NON-SHARED SECRETS FILE (Part 3)
// Secrets are loaded from a local .env file that is listed in
// .gitignore and never committed. Each person who runs the app
// creates their own .env (see README.md and .env.example).
// ---------------------------------------------------------------
const REQUIRED_SECRETS = ['API_KEY', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME', 'JWT_SECRET']

const result = require('dotenv').config({ quiet: true })

// Fail fast: stop with a clear error instead of running without secrets.
if (result.error) {
  console.error('ERROR: No .env file found. This app needs a .env file with its secrets.')
  console.error('Copy .env.example to .env and fill in the values. See README.md.')
  process.exit(1)
}

const missing = REQUIRED_SECRETS.filter((name) => !process.env[name])
if (missing.length > 0) {
  console.error(`ERROR: .env is missing these required secrets: ${missing.join(', ')}`)
  process.exit(1)
}

const express = require('express')
const crypto = require('crypto')
const app = express()
const port = 3000

const { API_KEY, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, JWT_SECRET } = process.env

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Secret 1: API key check. Only requests that send the right key get data.
// Try: /api/data?key=<the API_KEY value from your .env>
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
