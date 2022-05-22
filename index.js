const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());

// db connection uri 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jna9c.mongodb.net/?retryWrites=true&w=majority`;

// create mongo client 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// connecting to db 


async function run() {
    try{
        await client.connect();
        const productCollection = client.db("hyndaMotors").collection('products');

        // get products 
        app.get('/product', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // get individual product 
        app.get('/product/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const product = await productCollection.findOne(query);
          res.send(product);
        });
    }
    finally{
        console.log("Database Connected");
    }
}
// call the run method 
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server Running');
})

app.listen(port, () => {
  console.log(`Running Hynda Motors Server on port ${port}`);
})