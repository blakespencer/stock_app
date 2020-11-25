const router = require('express').Router();

router.get('/', async (req, res, next) => {
  try {
    res.send('api route');
  } catch (err) {
    next(err);
  }
});
module.exports = router;
