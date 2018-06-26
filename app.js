const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const auth = require('./middlewares/auth')
const images = require('./helpers/images')
const mongoose = require('mongoose')
const env = require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


const schema = makeExecutableSchema({ typeDefs, resolvers })
const app = express();

const username = process.env.USERNAME
const password = process.env.PASSWORD
const db = mongoose.connection

mongoose.connect(`mongodb://${username}:${password}@ds261450.mlab.com:61450/hacktivgram`)
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to mongoose')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/upload',
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res) => {
    res.send({
      status: 200,
      message: 'Your file is successfully uploaded',
      link: req.file.cloudStoragePublicUrl
    })
  }
)
app.use('/graphql', bodyParser.json(), auth, graphqlExpress(req => ({ schema, context : { user : req.user } })))
app.use('/graphiql', graphiqlExpress({ endpointURL:'/graphql' }))

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
