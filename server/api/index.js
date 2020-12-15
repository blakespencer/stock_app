const router = require('express').Router();

router.use('/iex', require('./iex'));

router.use('/av', require('./alphavantage'));

router.use('/polygon', require('./polygon'));

router.get('/', async (req, res, next) => {
  try {
    res.send('api route');
  } catch (err) {
    next(err);
  }
});
module.exports = router;
