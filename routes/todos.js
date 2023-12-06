// express.Router使用方式請詳官方文件
const express = require('express')
const router = express.Router()

// '..'表示上一層目錄
const db = require('../models')
const Todo = db.Todo

router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10

  return Todo.findAll({
    attributes: ['id', 'name', 'isComplete'],
    offset: (page - 1) * limit,
    limit,
    raw: true
  })
    // 可用req.flash('success')取出參數傳入hbs
    .then((todos) => res.render('todos', {
      todos,
      prev: page > 1 ? page - 1 : page,
      next: page + 1,
      page
    }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res, next) => {
  // 取得input內容，req.body.name是在input中設置的"name"
  const name = req.body.name
  // 當屬性名稱與變數名稱相同時，原為{ name: name }，可寫成{ name }
  // Todo.create是非同步，因此需要then在處理完成後執行後續程式
  return Todo.create({ name })
    .then(() => {
      // 用req.flash('key', 'value')來儲存結果，key跟value可以自定義
      req.flash('success', '新增成功!')
      // 新增後會導向 '/todos'，因此到該頁面取出flash
      return res.redirect('/todos')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗:('
      next(error)
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.get('/:id/edit', (req, res, next) => {

  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('edit', { todo }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const { name, isComplete } = req.body
  const id = req.params.id

  return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
    .then(() => {
      req.flash('success', '編輯成功!')
      return res.redirect(`/todos/${id}`)
    })
    .catch((error) => {
      error.errorMessage = '編輯失敗:('
      next(error)
    })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id

  return Todo.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功!')
      return res.redirect('/todos')
    })
    .catch((err) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

// express.Router使用方式請詳官方文件
module.exports = router