const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db/config/database');
const cookieParser = require('cookie-parser');

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Db connection
db.authenticate()
  .then(() => console.log('Authenticated'))
  .catch((err) => console.log(err));

//Routes
app.use('/users', require('./routes/accountRoutes/userRoutes'));
app.use('/orders', require('./routes/accountRoutes/ordersRoutes'));
app.use('/menuItemsTypes', require('./routes/menuRoutes/menuItemsTypesRoutes'));
app.use('/menuItems', require('./routes/menuRoutes/menuItemsRoutes'));
app.use('/tables', require('./routes/restaurantRoutes/tablesRoutes'));
app.use('/calendar', require('./routes/restaurantRoutes/calendarRoutes'));
app.use('/schedule', require('./routes/restaurantRoutes/scheduleRoutes'));

app.listen(8080, () => console.log('App is running...'));
