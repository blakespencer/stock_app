const router = require('express').Router();

router.get('/:symbol', async (req, res, next) => {
  try {
    res.send('api route');
  } catch (err) {
    next(err);
  }
});
module.exports = router;
