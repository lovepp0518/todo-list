const express = require('express')
const router = express.Router()

const todos = require('./todos')
const users = require('./users')

router.use('/todos', todos)
router.use('/users', users)

// 設置根路由
router.get('/', (req, res) => {
  res.render('index')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/login', (req, res) => {
  return res.send(req.body)
})

router.post('/logout', (req, res) => {
  return res.send('post: user logout')
})

module.exports = router