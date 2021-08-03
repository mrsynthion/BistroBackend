const express = require('express');
const app = express();
const db = require('./db/config/database');

// Db connection
db.authenticate()
  .then(() => console.log('Authenticated'))
  .catch((err) => console.log(err));

//Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/orders', require('./routes/ordersRoutes'));
app.use('/calendar', require('./routes/calendarRoutes'));
app.use('/ingredients', require('./routes/ingredientsRoutes'));
app.use('/tables', require('./routes/tablesRoutes'));
app.use('/menuItems', require('./routes/menuItemsRoutes'));

//Main route
app.get('/', (req, res) => res.send('Backend działa'));

app.listen(8080, () => console.log('App is running...'));
