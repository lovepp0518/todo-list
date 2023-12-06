const express = require('express');
const methodOverride = require('method-override'); // 使用 method override
const flash = require('connect-flash')
const session = require('express-session')
const app = express();
const port = 3000

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const { engine } = require('express-handlebars')

const router = require('./routes')

const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// 要使用 express.urlencoded 來從請求網址中獲取表單資料，否則就會回傳 undefined
app.use(express.urlencoded({ extended: true }))

// 使用 method override 以在表單使用PUT method(表單預設僅能使用GET&POST)
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

// 需放在session&flash之後，router之前
app.use(messageHandler)

app.use(router)

app.use(errorHandler)

// 啟動伺服器
app.listen(port, () => {
  console.log(`App is running on port ${port}.`);
});