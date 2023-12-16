// express.Router使用方式請詳官方文件
const express = require('express')
const router = express.Router()

// '..'表示上一層目錄
const db = require('../models')
const User = db.User

// 使用bcrypt.js進行密碼加鹽及雜湊
const bcrypt = require('bcryptjs')

router.post('/', (req, res, next) => {
  const { email, name, password, confirmPassword } = req.body

  if (!email || !password) {
    req.flash('error', 'email 及 password 為必填')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', '驗證密碼與密碼不符')
    return res.redirect('back')
  }

  return User.count({ where: { email } })
    .then((rowCount) => {
      if (rowCount > 0) {
        req.flash('error', 'email 已註冊')
        return
      }

      return bcrypt.hash(password, 10)
        .then((hash) => User.create({ email, name, password: hash }))
    })
    .then((user) => {
      if (!user) {
        return res.redirect('back')
      }

      req.flash('success', '註冊成功')
      return res.redirect('/login')
    })
    .catch((error) => {
      error.errorMessage = '註冊失敗'
      next(error)
    })
})

// express.Router使用方式請詳官方文件
module.exports = router