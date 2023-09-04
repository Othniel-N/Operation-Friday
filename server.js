const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/data', (req, res) => {
  // Your data retrieval logic here
  const dataToSend = { message: 'Hello from Express!' };

  // Send the data as JSON
  res.json(dataToSend);
});

// Proxy requests to MongoDB server (http://localhost:3002)
app.use('/proxy-mongodb', proxy('http://localhost:3002'));

// Proxy requests to another server (http://localhost:3003/get-data)
app.use('/proxy-get-data', proxy('http://localhost:3003'));

app.listen(port, () => {
  console.log(`Main server is running on port ${port}`);
});
