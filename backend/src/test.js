const express = require('express');
const app = express();

app.use(express.json());

app.post('/test', (req, res) => {
  res.json({ message: 'OK', data: req.body });
});

app.listen(3000, () => console.log('Test sur port 3000'));