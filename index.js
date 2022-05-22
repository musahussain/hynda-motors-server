const express = require('express')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server Running');
})

app.listen(port, () => {
  console.log(`Running Hynda Motors Server on port ${port}`);
})