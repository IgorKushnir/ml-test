export default function (req, res, next) {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    console.log('userAgent', userAgent)
    crossOriginIsolated.log('isBot', isBot)
  
    if (isBot) {
      req.ssr = true;
    } else {
      req.ssr = false;
    }

    console.log('req.ssr', req.ssr)
  
    next();
  }