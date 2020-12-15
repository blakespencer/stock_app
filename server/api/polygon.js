const router = require('express').Router();
const axios = require('axios');
const { Container } = require('typedi');

const { PolygonService } = require('../services');

router.get('/', async (req, res, next) => {
  try {
    res.send('this is polygon');
  } catch (error) {
    next(error);
  }
});

router.get('/:sym', async (req, res, next) => {
  try {
    const {
      params: { sym },
      query: { from },
    } = req;
    const polygonService = Container.get(PolygonService);
    const data = await polygonService.timeSeries(sym, from);
    res.send(data);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
