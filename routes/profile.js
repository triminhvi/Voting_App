var express = require('express');
var router = express.Router();
var Poll = require('../model/poll.js');
var User = require('../model/user.js');

router.get('/', isLoggedIn,function(req, res){
  console.log(req.user);
  Poll.find({"createdBy": req.user._id}, function(err, polls){
    if(err){
      console.log(err);
      return;
    }
    res.render('profile', {
      title: "profile",
      polls: polls
    });
  })
  
});

// router.get('/', function(req,res){
//   if(req.isAuthenticated()){
//     res.render('profile', {
//       title: "profile"
//     })
//   } else {
//     res.redirect('/auth/login');
//   }
// });

router.get('/addPoll', isLoggedIn, function(req, res){
  res.render('addNewPoll', {title: "Add Poll",
                            message: req.flash('pollMessage')});
});

router.post('/addPoll', isLoggedIn, function(req,res){
  var title = req.body.title;
  var answer = req.body.answer;
  var createdUser = req.user._id;
  Poll.findOne({"title": title}, function(err, poll){
    if(err){
      throw error;
      return
    }
    if(poll){ //This poll is already existed
      console.log("This question is already existed");
      req.flash('pollMessage', 'Poll is already existed');
      res.redirect('/profile/addPoll');
    } else {
      var newPoll = new Poll();
      newPoll.createdBy = createdUser;
      newPoll.title = title;
      // For a single option answer
      if(typeof answer === 'string'){
        newPoll.answer.push({
          title: answer,
          number: 0,
        })
      } else { //For multiple options answer
        answer.forEach(function(item){
          newPoll.answer.push({
            title: item,
            number: 0
          })
        });
      }
      //adding IP to check if the user is already voted
      // var ip = req.connection.remoteAddress;
      // newPoll.ip.push({
      //   address: ip,
      //   voted: false
      // })
      newPoll.voteBy.push({
        userID: req.user._id,
        isVoted: false
      })
      newPoll.save(function(err){
        if(err){
          console.log(err);
        }
        res.redirect('/profile');
      })
    }
  }); 
});

//myPoll
// router.get('/myPoll', isLoggedIn, function(req,res){
//   Poll.find({}, function(err, polls){
//     if(err){
//       throw err;
//       return;
//     } 
//     res.render('myPoll', {title: "My Poll", polls: polls});
//   })
// });

router.get('/:id', isLoggedIn, function(req,res){
  var id = req.params.id;
  //console.log(id);
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

router.post('/:id', isLoggedIn, function(req,res){
  var id = req.params.id;
  var index = req.body.optionsRadios;
  Poll.findOne({'_id': id}, function(err, poll){
    if(err){
      console.log(err);
      return;
    }
    //check if the person is already voted
    for(var i = 0 ; i<poll.voteBy.length; i++){
      var checkUserID = poll.voteBy[i].userID;
      var isVoted = poll.voteBy[i].isVoted;
      if((checkUserID == req.user._id) && (isVoted == true)){
        req.flash('pollMessage', 'You are already voted');
        res.redirect('/profile/'+id);
        return;
      }
    }
    //If the person is not voted
    poll.answer[index].number++;
    poll.voteBy.push({
      userID: req.user._id,
      isVoted: true
    });
    // for(var i = 0; i< poll.voteBy.length; i++){
    // //   var checkUserID = poll.voteBy[i].userID;
    // //   if(checkUserID == req.user._id){
    // //     poll.voteBy[i].isVoted = true;
    // //     break;
    // //   }
    // // }
    poll.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      res.redirect('/profile/'+id);
    });
  });
}); 

router.get('/delete/:id', function(req,res){
  var id = req.params.id;
  Poll.findById(id, function(err, poll){
    if(err){
      console.log(err);
      return;
    }
    Poll.remove(poll, function(err){
      if(err){
        console.log(err);
        return;
      }
      res.redirect("/profile");
    })
  });
});



/* isLoggedIn function */
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/auth/login');
}

module.exports = router;