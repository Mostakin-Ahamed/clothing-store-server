const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mostakinahamed.fo1obhn.mongodb.net/?retryWrites=true&w=majority&appName=MostakinAhamed`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("ClothingStore").collection("itemsCollection");
    const myCart = client.db("ClothingStore").collection("usersCart");

    app.get('/', async(req, res)=>{
        const result = await database.find().toArray();
        res.send(result)
    })

    app.get('/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await database.findOne(query);
        res.send(result)
    })
    app.get('/myCart', async(req, res)=>{
        const email = req.params.email;
        let query = {};
        if(req.query?.email){
            query={email: email }
        }
        const result = await myCart.find(query).toArray();
        res.send(result)
    })

    app.post('/addToCart', async(req, res)=>{
        const cartItem = req.body;
        
        const result = await myCart.insertOne(cartItem);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


// app.get('/', (req, res)=>{
//     res.send('clothing store server is running')
// })

app.listen(port, ()=>{
    console.log(`clothing store server is running on port ${port}`);
})