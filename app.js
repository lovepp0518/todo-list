const express = require('express');
const methodOverride = require('method-override'); // 使用 method override
const flash = require('connect-flash')
const session = require('express-session')
const app = express();
const port = 3000

const { engine } = require('express-handlebars')

const db = require('./models')
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// 要使用 express.urlencoded 來從請求網址中獲取表單資料，否則就會回傳 undefined
app.use(express.urlencoded({ extended: true }))

// 使用 method override 以在表單使用PUT method(表單預設僅能使用GET&POST)
app.use(methodOverride('_method'))
app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

// 設置根路由
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/todos', (req, res) => {
  try {
    return Todo.findAll({
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      // 可用req.flash('success')取出參數傳入hbs
      .then((todos) => res.render('todos', { todos, message: req.flash('success'), error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

app.get('/todos/new', (req, res) => {
  try {
    return res.render('new', { error: req.flash('error') })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

app.post('/todos', (req, res) => {
  try {
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
        console.error(error)
        req.flash('error', '新增失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '新增失敗')
    return res.redirect('back')
  }
})

app.get('/todos/:id', (req, res) => {
  try {
    const id = req.params.id
    return Todo.findByPk(id, {
      attributes: ['id', 'name'],
      raw: true
    })
      .then((todo) => res.render('todo', { todo, message: req.flash('success'), error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

app.get('/todos/:id/edit', (req, res) => {
  try {
    const id = req.params.id
    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => res.render('edit', { todo, error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

app.put('/todos/:id', (req, res) => {
  try {
    const { name, isComplete } = req.body
    const id = req.params.id

    return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
      .then(() => {
        req.flash('success', '編輯成功!')
        return res.redirect(`/todos/${id}`)
      })
      .catch((err) => {
        console.log(err)
        req.flash('error', '編輯失敗')
        return res.redirect('back')
      })
  } catch {
    console.log(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

app.delete('/todos/:id', (req, res) => {
  try {
    const id = req.params.id

    return Todo.destroy({ where: { id } })
      .then(() => {
        req.flash('success', '刪除成功!')
        return res.redirect('/todos')
      })
      .catch((err) => {
        console.log(err)
        req.flash('error', '刪除失敗')
        return res.redirect('back')
      })
  } catch {
    console.log(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }

})

// 啟動伺服器
app.listen(port, () => {
  console.log(`App is running on port ${port}.`);
});