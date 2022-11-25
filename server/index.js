const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
  res.send("It is the home page");
});

const salesforceRouter = require('./routes/salesforce.js');

app.use('/salesforce',salesforceRouter);


app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});