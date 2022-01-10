const { default: axios } = require('axios');
const fs = require('fs');
const express = require('express');

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: "AKIAY47BG72O7POQH3FD",
  secretAccessKey: "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",
  "region": "eu-west-2"
});
// AWS.config.update({ region: 'eu-west-2' });

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
// https://api-demo-harish.s3.eu-west-2.amazonaws.com/demo.json
const bucket = 'api-demo-harish';

const bucketParams = { Bucket: bucket, Key: 'demo.json' };
const uploadBucketParams = { Bucket: bucket, Key: 'test.json' };

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

app.get('/api/triggerBucket', async (req, res, next) => {
  s3.getObject(bucketParams, function (err, data) {
    const stringData = data.Body.toString();
    const jsonData = JSON.parse(stringData);
    const modifiedData = jsonData.map((d, index) => {
      d.addedKey = `Adding the new key for demo : ${index + 4}`;
      return d;
    });
    
    uploadBucketParams['Body'] = JSON.stringify(modifiedData);
    uploadBucketParams['ContentType'] = "application/json";
    s3.upload(uploadBucketParams, function (err,data) {
      console.log(JSON.stringify(err) + " " + JSON.stringify(data));
    });
  });
  return res.status(200).json({
    data: {
      message: 'Request successful',
    },
  });
});

app.listen(appPort, () => {
  console.log(`Server 1 is ready on port : ${appPort}`);
});
