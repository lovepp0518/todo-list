const express = require('express');
const app = express();
const port = 3000

// 設置根路由
app.get('/', (req, res) => {
  res.send('hello world');
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`App is running on port ${port}.`);
});