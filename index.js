const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


app.get('/', (req, res) =>{
    res.send('Get Toy Cars Server is running')
})
// ---------------------------------- MongoDB Operation ---------------



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.5julrfk.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCarCollection = client.db("toyCarDB").collection("toyCar")
    
    app.post('/addToy', async(req, res) =>{
      const newToyCar = req.body;
      // console.log(newToyCar)
      const result = await toyCarCollection.insertOne(newToyCar);
      console.log(result)
      res.send(result)
    })

    app.get('/allToyCar', async(req, res) =>{
      const cursor = toyCarCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/toyCar/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toyCarCollection.findOne(query);
      console.log(result);
      res.send(result)
    })


    // ----------- My Toy Car ------------
    app.get('/my-toy-car', async(req, res) =>{
      console.log(60, req.body)

      // let query = {}
      // if(req,query?.email){
      //   query = { email: req.query.email}
      // }

      const result = await toyCarCollection.find(query).toArray();
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () =>{
   console.log(`Get Toy Cars Server is Running on Port: ${port}`)
})