const express = require('express')
const router = express.Router()
const passport = require('passport')

const todos = require('./todos')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.use('/todos', authHandler, todos)
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

router.post('/login', passport.authenticate('local', {
  successRedirect: '/todos',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/todos',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/logout', (req, res) => {
  return res.send('post: user logout')
})

module.exports = router