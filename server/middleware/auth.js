const models = require('../models');
const Promise = require('bluebird');
const parseCookies = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  console.log('REQ.COOKIES: ', req.cookies);
  if (Object.keys(req.cookies).length === 0) {
    return models.Sessions.create()
      .then(createdData => {
        console.log('CREATED DATA: ', createdData);
        return models.Sessions.get({'id': createdData.insertId});
      })
      .then(gottenData => {
        req.session = {hash: gottenData.hash};
        console.log('REQ SESSION: ', req.session);
        req.headers.cookie = res.cookie('shortlyid', gottenData.hash);
        console.log('REQ HEADERS COOKIE: ', req.headers.cookie);
        next();
      })
      .catch(err => {
        throw err;
      });
  }


};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

