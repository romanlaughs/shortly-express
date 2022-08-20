const models = require('../models');
const Promise = require('bluebird');
const parseCookies = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  // if no shortly cookie
  if (!req.cookies.shortlyid) {
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

          req.session = {hash: gottenData.hash};
          // if session specifies user ID, add user data
          if (gottenData.userId) {
            req.session.userId = gottenData.userId;
            req.session.user = {};
            req.session.user.username = gottenData.user.username;
          }
          req.headers.cookie = res.cookie('shortlyid', gottenData.hash);
          next();
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

