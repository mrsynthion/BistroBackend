const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Backend działa'));

app.listen(8080, () => console.log('App is running...'));
