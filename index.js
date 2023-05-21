const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

require('dotenv').config('')


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ulul2vm.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();


        const toyCollection = client.db("toyVerse").collection('Car');



        app.get('/car', async (req, res) => {
            const cursor = await toyCollection.find()
            const result = await cursor.toArray()
            res.send(result);
        })


        app.get('/car/:text', async (req, res) => {
            if (req.params.text == 'Sports' || req.params.text == 'Normal' || req.params.text == 'SUV') {
                const result = await toyCollection.find({ category: req.params.text }).toArray();
                return res.send(result)
            }
            const result = await toyCollection.find({}).toArray();
            res.send(result)
        })

        app.get('/toy', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/toy', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toyCollection.insertOne(newToy)
            res.send(result)
        })

        app.get('/toy/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await toyCollection.find({ sellerEmail: req.params.email }).toArray();
            res.send(result);
        })
        // update my toys data
        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result);

        })




        app.get('/singleCar/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { _id: 0, toyName: 1, picture: 1, sellerName: 1, email: 1, quantity: 1, price: 1, email: 1, details: 1 }
            }
            const result = await toyCollection.findOne(query, options);
            res.send(result);

        })
        // delete my toys

        app.delete('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // client.db("toyVerse").collection('Car')
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("toy is running")
})


app.listen(port, () => {
    console.log(`toy verse is running on port ${port}`);
})