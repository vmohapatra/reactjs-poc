var express = require('express');
var fs = require('fs');
var path = require('path');
var hbs = require('hbs');
var expressHbs = require('express3-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require('./config');

var app = express();

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use(express.static('static'));
app.use('/static', express.static(__dirname + '/static_resources'));

// view engine setup to use Handlebars templates
app.set('views', path.join(__dirname, 'views'));
//Set .hbs as the default extension to be used in view engine for the app
app.engine('hbs', expressHbs({extname:'hbs'}));
app.set('view engine', 'hbs');

//Use register partials to get partial templates from the specific partials directory "partials"
hbs.registerPartials(__dirname + '/views/partials');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Use a session
app.use(session({
    secret: "qwerty987dfg878Q6sdfwe34dsfgh", 
    resave: false, 
    saveUninitialized: true
}));

var COMMENTS_FILE = path.join(__dirname+'/db/', 'comments.json');


app.get('/', function (req, res) {
    res.redirect('/main');
});

app.get('/main', function (req, res) {
    res.render(
        app.get('views') + '/layouts/'+ 'main'
    );
});

app.get('/commentbox', function (req, res) {
    res.render(
        app.get('views') + '/layouts/'+ 'comments'
    );
});

app.get('/productfilter', function (req, res) {
    res.render(
        app.get('views') + '/layouts/'+ 'productfilter'
    );
});


app.get('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    // NOTE: In a real implementation, we would likely rely on a database or
    // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
    // treat Date.now() as unique-enough for our purposes.
    var newComment = {
      id: Date.now(),
      author: req.body.author,
      text: req.body.text,
    };
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});

app.listen(config.http_port, function () {
  console.log('App listening on port : '+config.http_port);
  console.log('Please access app at http://localhost:'+config.http_port);
  //console.log(config.root);
  //console.log("Variable __dirname : "+__dirname);
});

module.exports = app;