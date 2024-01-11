const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const basicAuth = require('express-basic-auth');
require('dotenv').config(); // .env ファイルを読み込む


const indexRouter = require('./routes/index');
const contactsRouter = require('./routes/contacts');
const adminsRouter = require('./routes/admins');
const blogsRouter = require('./routes/blogs')

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Basic認証の設定
const basicAuthMiddleware = basicAuth({
  users: {[process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD},
  challenge: true,
  unauthorizedResponse: 'Unauthorized Access!'
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 静的ファイルの提供
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// jQueryを提供する
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));



app.use('/', indexRouter);
app.use('/contacts', contactsRouter);
app.use('/blogs', blogsRouter);

// admin以下は認証が必要
app.use('/admin', basicAuthMiddleware, adminsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
