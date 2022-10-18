const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const { parseRecord } = require('./utils/parser');

app.use(express.json());

app.all('/*', (req, res) => {
  console.log(parseRecord(req.body));
  res.status(200).end();
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
