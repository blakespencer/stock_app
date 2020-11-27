const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');

require('./config');

app.disable('x-powered-by');

app.use('/api', require('./api'));

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '..', 'client', 'build', 'index.html')
    );
  });
}
app.listen(PORT, function () {
  console.log('Server started on port: ' + PORT);
});
