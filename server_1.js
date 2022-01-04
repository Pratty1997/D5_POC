const express = require('express');

const app = express();

app.use(express.json());

const serverPort = 8001;

app.get('/', (req, res, next) => {
  return res.status(200).json({
    data: {
      message: 'Server 2 sends their hello!',
    },
  });
});

app.post('/endpoint2', (req, res, next) => {
  const requestBody = req.body;

  // console.log(req);

  if (!requestBody) {
    console.log('No body provided');
    return res.status(400).json({
      error: {
        message: 'Required parameter not provided',
      },
    });
  }

  if (Object.keys(requestBody).length === 0) {
    console.log(`An empty request received from ${req.headers.host}`);
    return res.status(400).json({
      error: {
        message: 'Did you forget to send something?',
      },
    });
  }

  // Check if the request has some internal authentication mechanism satisfied.
  const token = req.headers.token;

  if (!token || token !== 'hey!') {
    console.log(`Authentication failed for host : ${req.headers.host}`);
    return res.status(401).json({
      error: {
        message: 'Failed to authenticate',
      },
    });
  }

  // Do some process here.
  return res.status(200).json({
    data: {
      message: 'Request successfully processed on server 2',
    },
  });
});

app.listen(serverPort, () => {
  console.log(`Server 2 started listening on port ${serverPort}`);
});
