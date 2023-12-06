const express = require('express')
const router = express.Router()

const todos = require('./todos')

router.use('/todos', todos)

// 設置根路由
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router