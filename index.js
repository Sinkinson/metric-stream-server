const express = require('express');
const app = express();
const PORT = process.env.PORT || 4318;
const { parseRecord } = require('./utils/parser');

app.use(express.json());

app.all('/*', (req, res) => {
  console.log(parseRecord(req.body));

  // const data = req.body.records.map(obj => obj.data);
  // console.log(data);
  // const result = parseRecord(data);
  res.status(200).end();
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
