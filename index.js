const { default: axios } = require('axios');
const express = require('express');

const app = express();

app.use(express.json());

const appPort = 8000;

app.get('/', (req, res, next) => {
  return res.status(200).json({
    data: {
      message: 'Hello from server 1',
    },
  });
});

app.post('/endpoint1', async (req, res, json) => {
  const requestBody = req.body;
  if (!requestBody) {
    console.log('No body provided');
    return res.status(400).json({
      error: {
        message: 'Required parameter not provided',
      },
    });
  }

  if (Object.keys(requestBody).length === 0) {
    console.log(`An empty request arrived from ${req.headers.host}`);
    return res.status(400).json({
      error: {
        message: 'Did you forget to add something to the body ?',
      },
    });
  }

  try {
    const responseFromServer2 = await axios.post(
      'http://localhost:8001/endpoint2',
      {
        details: requestBody,
      },
      {
        headers: {
          token: 'hey!',
        },
      },
    );
    
    // console.log(responseFromServer2);
    console.log('Request successfully received by server 2');
  
    return res.status(200).json({
      data: {
        message: 'Request processed successfully',
      },
    });
  } catch (ex) {
    console.log('Request failed at server 2');
    return res.status(400).json({
      error: {
        message: 'Request failed at server 2',
      },
    });
  }
});

app.listen(appPort, () => {
  console.log(`Server 1 is ready on port : ${appPort}`);
});
