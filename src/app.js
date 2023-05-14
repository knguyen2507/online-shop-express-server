'use strict'

const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const compression = require('compression');
const { default: helmet } = require('helmet');
const cors = require('cors');
const db = require('./database/init.mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
// routes
const userRouter = require('./api/routes/user.router');
const productRouter = require('./api/routes/product.router');
const categoryRouter = require('./api/routes/category.router');
const brandRouter = require('./api/routes/brand.router');
const cartRouter = require('./api/routes/cart.router');
const paymentRouter = require('./api/routes/payment.router');

const app = express();
// init middlewares
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public/')));
app.use(cookieParser());
// databases
console.log(`dirname:::`, __dirname)
db;
// init routes
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/brand', brandRouter);
app.use('/cart', cartRouter);
app.use('/payment', paymentRouter);
// handling error
app.use((req, res, next) => {
    next(createError.NotFound('This route does not exist!'));
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        code: err.status || 500,
        message: err.message
    })
})

// export module
module.exports = app;