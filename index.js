const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnzewy6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const contactCollection = client.db('ContacttDB').collection('contacts');


    // insert the data to the database 
    app.post('/contacts', async (req, res) => {
      const newContact = req.body;
      console.log(newContact);
      const result = await contactCollection.insertOne(newContact);
      res.send(result);
    })

    // read the all data to the server 
    app.get('/contacts', async (req, res) => {
        const cursor = contactCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})