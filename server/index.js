const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');

app.use('/api', require('./api'));

if (process.env.NODE_ENV) {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
app.listen(PORT, function () {
  console.log('Server started on port: ' + PORT);
});
