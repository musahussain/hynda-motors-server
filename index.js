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
        const orderCollection = client.db("hyndaMotors").collection("orders");
        const reviewCollection = client.db("hyndaMotors").collection("reviews");

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

        // add orders 
        app.post('/order', async (req, res) => {
          const newOrder = req.body;
          const result = await orderCollection.insertOne(newOrder);
          res.send(result);
        });

        // get a user orders 
        app.get('/order/:email', async (req, res) => {
          const email = req.params.email;
          const query = {email: email};
          const cursor = orderCollection.find(query);
          const orders = await cursor.toArray();
          res.send(orders);
        });

        // delete order of a user 
        app.delete('/order/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await orderCollection.deleteOne(query);
          res.send(result);
      });

      // add a review from a user 
      app.post('/addreview', async (req, res) => {
        const newReview = req.body;
        const result = await reviewCollection.insertOne(newReview);
        res.send(result);
      });

      app.get('review', async(req, res) => {
        const query = {};
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews)
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
});

app.listen(port, () => {
  console.log(`Running Hynda Motors Server on port ${port}`);
});