const models = require('../models');
const Promise = require('bluebird');
const parseCookies = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  // if no shortly cookie
  if (!req.cookies || !req.cookies.shortlyid) {
    console.log('NO COOKIE!');
    return models.Sessions.create()
      .then(createdData => {
        return models.Sessions.get({'id': createdData.insertId});
      })
      .then(gottenData => {
        req.session = {hash: gottenData.hash};
        req.headers.cookie = res.cookie('shortlyid', gottenData.hash);
        next();
      })
      .catch(err => {
        throw err;
      });
  // else there is a shortly cookie
  } else {
    return models.Sessions.get({'hash': req.cookies.shortlyid})
      .then(gottenData => {
        if (gottenData) {
          // if Session assigned to cookie
          req.session = {hash: gottenData.hash};
          // if session specifies user ID, add user data
          if (gottenData.userId) {
            req.session.userId = gottenData.userId;
            req.session.user = {};
            req.session.user.username = gottenData.user.username;
          }
          req.headers.cookie = res.cookie('shortlyid', gottenData.hash);
          next();
          // if No Session assigned to cookie
        } else {
          return models.Sessions.create()
            .then(createdData => {
              return models.Sessions.get({'id': createdData.insertId});
            })
            .then(gottenData => {
              req.session = {hash: gottenData.hash};
              req.headers.cookie = res.cookie('shortlyid', gottenData.hash);
              next();
            });
        }
      })
      .catch(err => {
        throw err;
      });
  }
};


/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  // check cookie exists
  if (!req.cookies || !req.cookies.shortlyid) {
    res.redirect('signup');
    //return next();

  } else {
    // Cookie exists
    // check session
    if (models.Session.isLoggedIn(req.session)) {
      // session is good
      return;
    } else {
      res.redirect('login');
      //return next();
    }
  }
};