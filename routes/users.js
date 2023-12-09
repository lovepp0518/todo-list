// express.Router使用方式請詳官方文件
const express = require('express')
const router = express.Router()

// '..'表示上一層目錄
const db = require('../models')
const User = db.User

router.post('/', (req, res) => {
  return res.send(req.body)
})

// express.Router使用方式請詳官方文件
module.exports = router