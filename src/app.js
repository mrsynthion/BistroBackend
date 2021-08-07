const express = require('express');
const app = express();
const db = require('./db/config/database');

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use('/schedule', require('./routes/scheduleRoutes'));

//Main route
app.get('/', (req, res) => res.send('Backend działa'));

app.listen(8080, () => console.log('App is running...'));
