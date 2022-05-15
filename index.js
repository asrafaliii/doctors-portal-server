const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lovoj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('doctors_portal').collection('services');
        const bookingCollection = client.db('doctors_portal').collection('bookings');

        app.get('/service', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        });

        /**
         * API Naming Convention
         * app.get('/booking') // get all boking in this collection. or get more than one or by filter
         * app.get('/bookign/:id') // get a sprcific booking
         * app.post('booking') add a new booking
         * app.patch('booking/:id')//
         * app.delete(bookign/:id) //
         */

        app.post('/booking', async(req, res) =>{
            booking = req.body;
            const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}
            const result = await bookingCollection.insertOne(booking);
            res.send(result);

        })

    }
    finally{

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('hello From Doctor Portal')
})

app.listen(port, () =>{
    console.log('Doctors App')
})