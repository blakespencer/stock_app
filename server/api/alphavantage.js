const router = require('express').Router();
const axios = require('axios');
const { Container } = require('typedi');

const { AlphaVantageService } = require('../services');

router.get('/', async (req, res, next) => {
  try {
    res.send('this is alpha vantage');
  } catch (error) {
    next(error);
  }
});

router.get('/:sym', async (req, res, next) => {
  try {
    const { sym } = req.params;
    const alphaVantageService = Container.get(AlphaVantageService);
    const data = await alphaVantageService.getTimeSeriesAdjusted(sym);
    res.send(data);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
