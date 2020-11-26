const router = require('express').Router();
const iex = require('iexcloud_api_wrapper');

const quote = async (sym) => {
  const quoteData = await iex.quote(sym);
  // do something with returned quote data
  console.log(quoteData);
  return quoteData;
};

router.get('/', async (req, res, next) => {
  try {
    res.send('this is iex');
  } catch (error) {
    next(error);
  }
});

router.get('/:sym', async (req, res, next) => {
  try {
    const data = await quote(req.params.sym);
    res.send(data);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
