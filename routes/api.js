'use strict'

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* API specific routes */
router.route('/register')
  .post(function(req, res) {
    const name = {
      firstname: req.body.firstname, lastname: req.body.lastname
    }
    const username = req.body.username;
    const password = req.body.password;

    //Should probably make /register its own route, and if the username is valid, send a 200 http status code and send the information here.
    //That way /api/register only takes the 200 status codes
    if(username != username.match(/^[a-z\d]+$/i))
      return res.sendStatus(403);


    let newUser = new User();
    newUser.name = name;
    newUser.username = username;
    newUser.password = password;
    newUser.save(function(err, savedUser) {
      if(err)
        return res.sendStatus(500);

      return res.send('OK!').status(200);
    });
  });

router.route('/login')
  .post(function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
      if(err)
        res.send(err);

      user.comparePassword(req.body.password, function(err, isMatch) {
        if(err)
          res.send(err);

        //Correct password.
        if(isMatch) {
          req.session.user = user;
          return res.sendStatus(200);
        }
        return res.sendStatus(401);
      });
    });
  });

module.exports = router;