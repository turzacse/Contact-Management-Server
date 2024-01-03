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

    app.get('/contacts/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};

        const options = {
            projection: {name: 1, email:1, phone:1, address: 1, img:1 },
          };

        const result = await contactCollection.findOne(query);
        res.send(result);
    })

    app.delete('/contacts/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await contactCollection.deleteOne(query);
        res.send(result);
    })

    app.put('/contacts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateInfo = req.body;
  
      try {
          let updateQuery = {};
  
          // Case 1: Update the 'role' field only
          if (updateInfo.role !== undefined) {
              updateQuery = {
                  $set: {
                      role: updateInfo.role
                  }
              };
          } else {
              // Case 2: Update other fields while keeping 'role' unchanged
              const { name, email, phone, address } = updateInfo;
              updateQuery = {
                  $set: {
                      name: name,
                      email: email,
                      phone: phone,
                      address: address
                      // Add more fields to update here as needed
                  }
              };
          }
  
          const result = await contactCollection.updateOne(filter, updateQuery);
          res.send(result);
      } catch (error) {
          res.status(500).send(error);
      }
  });
  


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