const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db/config/database');

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Db connection
db.authenticate()
  .then(() => console.log('Authenticated'))
  .catch((err) => console.log(err));

//Routes
app.use('/users', require('./routes/accountRoutes/userRoutes'));
app.use('/orders', require('./routes/accountRoutes/ordersRoutes'));
app.use('/ingredients', require('./routes/menuRoutes/ingredientsRoutes'));
app.use('/menuItems', require('./routes/menuRoutes/menuItemsRoutes'));
app.use('/tables', require('./routes/restaurantRoutes/tablesRoutes'));
app.use('/calendar', require('./routes/restaurantRoutes/calendarRoutes'));
app.use('/schedule', require('./routes/restaurantRoutes/scheduleRoutes'));

//Main route
app.get('/', (req, res) => res.send('Backend działa'));

app.listen(8080, () => console.log('App is running...'));
