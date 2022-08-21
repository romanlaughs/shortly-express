

const parseCookies = (req, res, next) => {

  let cookieString = req.get('Cookie');

  if (!cookieString) {
    next();
  }

  let parsedCookies = cookieString.split('; ').reduce((cookies, cookie) => {
    if (cookie) {
      let cookieParts = cookie.split('=');
      cookies[cookieParts[0]] = cookieParts[1];
    }
    return cookies;
  }, {});

  req.cookies = parsedCookies;
  next();
};


module.exports = parseCookies;