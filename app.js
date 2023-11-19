const express = require('express');
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

// 設置根路由
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todos) => res.render('todos', { todos }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
  res.render('new')
})

app.post('/todos', (req, res) => {
  // 取得input內容，req.body.name是在input中設置的"name"
  const name = req.body.name
  // 當屬性名稱與變數名稱相同時，原為{ name: name }，可寫成{ name }
  // Todo.create是非同步，因此需要then在處理完成後執行後續程式
  return Todo.create({ name })
    .then(() => res.redirect('/todos'))
    .catch((err) => console.log(err))
})

app.get('/todos/:id', (req, res) => {
  res.send(`get todo: ${req.params.id}`)
})

app.get('/todos/:id/edit', (req, res) => {
  res.send(`get todo edit: ${req.params.id}`)
})

app.put('/todos/:id', (req, res) => {
  res.send('modify todo')
})

app.delete('/todos/:id', (req, res) => {
  res.send('delete todo')
})

// 啟動伺服器
app.listen(port, () => {
  console.log(`App is running on port ${port}.`);
});