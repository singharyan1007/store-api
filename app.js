require('dotenv').config();
const express = require('express');
require("express-async-errors");
const app = express();
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('<h1>Store api</h1><a href="/api/v1/products">products route</a>');
});
app.use('/api/v1/products',productsRouter)
const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
