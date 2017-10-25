var compression = require('compression');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var url = require('./config/db.js').url;
mongoose.connect(url);
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon')
var path = require('path');
var app = express();

/* ****************************************** */
app.use(compression());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

/* ****************************************** */
//DB
var db = mongoose.connection;
db.on('error', function(error){
  console.log(error);
});
db.on('open', function(){
  console.log('Connected to DB');
});
var User = require('./model/user.js');
var Poll = require('./model/poll.js');

/* ****************************************** */
//Passport Config
require('./config/passport.js')(passport);

/* ****************************************** */
//APP
var auth = require('./routes/auth');
app.use('/auth', auth);
var profile = require('./routes/profile');
app.use('/profile', profile);

//ROUTE - FOR UNAUTHORIZED USERS
app.get('/', function(req, res){
  Poll.find({}, function(err, polls){
    if(err){
      console.log(err);
      return;
    }
    res.render('mainpage', {
      title: "mainpage",
      polls: polls,
      message: req.flash('pollMessage')
    });
  });
});

//GET SINGLE VOTE
app.get('/:id', function(req, res){
  var id = req.params.id;
  Poll.findOne({"_id": id}, function(err, poll){
    if(err){
      console.log(err);
      return;
    }

    res.render('singlePoll', {title: "Single Poll",
                              poll: poll,
                              message: req.flash('pollMessage')});
  });
}); 


// app.post('/:id', function(req,res){
//   var id = req.params.id;
//   var index = req.body.optionsRadios;
//   Poll.findOne({'_id': id}, function(err, poll){
//     if(err){
//       console.log(err);
//       return;
//     }
//     //check if the person is already voted
//     for(var i = 0 ; i<poll.ip.length; i++){
//       var checkIp = poll.ip[i].address;
//       var isVoted = poll.ip[i].voted;
//       if((checkIp == req.connection.remoteAddress) && (isVoted == true)){
//         req.flash('pollMessage', 'You are already voted');
//         res.redirect('/'+id);
//         return;
//       }
//     }
//     //If the person is not voted
//     poll.answer[index].number++;
//     for(var i = 0; i< poll.ip.length; i++){
//       var checkIp = poll.ip[i].address;
//       if(checkIp == req.connection.remoteAddress){
//         poll.ip[i].voted = true;
//         break;
//       }
//     }
//     poll.save(function(err){
//       if(err){
//         console.log(err);
//         return;
//       }
//       res.redirect('/'+id);
//     });
//   });
// });

app.listen(process.env.PORT || 3000, function(){
  console.log('Listening on port 3000');
});



