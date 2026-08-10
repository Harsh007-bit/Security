

const express = require('express')
const users = require('./user.json')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.get('/', (req, res) => {
    res.send('harsh')
})

app.get('/api/users', (req, res) => {
    res.json(users)
})

app.listen(5000, () => {
    console.log('Server running on port 5000')
})