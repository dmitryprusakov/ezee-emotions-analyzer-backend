import express from 'express';
import cookieParser from 'cookie-parser';
import { MongoClient } from 'mongodb';

import { configureSwagger } from './src/swagger';
import { configureMulter } from './src/files-storage';
import { initItemsRoutes } from './src/routes';

const PORT = process.env.PORT || 3000;

const uri = "mongodb://localhost:27017"

const app = express();

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(cookieParser());
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', request.headers.origin);
  response.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  response.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS');
  response.header('Access-Control-Allow-Credentials', 'true');
  next();
});

configureSwagger(app);
configureMulter(app);

const client = new MongoClient(uri, { keepAlive: true });

async function main() {
  try {
    await client.connect();

    console.log('Connected correctly to server');

    app.listen(PORT, () => {
      console.log('We are live on ' + PORT);

      const mainDb = client.db('emotions');
      initItemsRoutes(app, mainDb);
    });
  } catch (error) {
    console.log('ERROR EXECUTED: ', error);
  }
};

main();

module.exports = app;

