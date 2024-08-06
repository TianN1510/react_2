var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
require('./models/category');
require('./models/product');
require('./models/user');
require('./models/category_react');
require('./models/product_react');
require('./models/detail');
mongoose.connect('mongodb+srv://tonystarkmarkell:Vvhs3Ly4wa6WTh3M@cluster0.slo92h6.mongodb.net/and103', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => console.log('>>>>>>>>>>>>>>>>>DB connected !!!!!!'))
  .catch(err => console.log('>>>>>>>>>>>>>>>>>DB  error', err))

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var danhSachRouter = require('./routes/products');
var categoriesRouter = require('./routes/categoryRoute');
var categories_reactRouter = require('./routes/categories_react');
var product_reactRouter = require('./routes/products_react');
var detailRoute = require('./routes/detailRoute');
var app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-config.js');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/san-pham', danhSachRouter);
app.use('/danh-muc', categoriesRouter);
app.use('/type-course', categories_reactRouter);
app.use('/course', product_reactRouter);
app.use('/detail', detailRoute);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// Thêm đoạn mã này để xử lý lỗi 404
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
