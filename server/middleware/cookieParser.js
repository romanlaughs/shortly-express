const helper = function(acc = {}, cookieInput) {
  var array = cookieInput.trim().split('=');
  //Awesome Job!!!!
  var obj = {};
  obj[array[0]] = array[1];
  return Object.assign(acc, obj);
};

const parseCookies = (req, res, next) => {
  const cookie = req.headers.cookie;

  if (cookie === undefined) {
    res.end({});
    next();
    return;
  }

  let parsedCookies = cookie.split(';');

  if (Array.isArray(parsedCookies)) {
    parsedCookies = parsedCookies.reduce(helper, {});
  } else {
    parsedCookies = helper({}, parsedCookies);
  }

  req.cookies = parsedCookies;
  res.end();
  next();
};


module.exports = parseCookies;