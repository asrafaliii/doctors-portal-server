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
        const userCollection = client.db('doctors_portal').collection('users');

        app.get('/service', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        });

        app.put('/user/:email', async(req, res) =>{
            const email = req.params.email;
            const filter = {email: email};
            const options = {upsert: true};
            const updateDoc = {
                $set: user,     
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/available', async(req, res) =>{
            const date = req.query.date;

            // step 1: get all services
            const services = await serviceCollection.find().toArray();

            // step 2: get the booking of that day
            const query = {date: date};
            const bookings = await bookingCollection.find(query).toArray();

            

            // step 3: for each service, 
            services.forEach(service =>{
                // step 4: find booking for that service
                const serviceBookings = bookings.filter(book => book.treatment === service.name)
                // step 5: select slots for the service bookings: ['','','']
                const bookedSlots = serviceBookings.map(book => book.slot);
                // step 6: select those slots that are not in bookedSlot
                const available = service.slots.filter(slot => !bookedSlots.includes(slot))
                // step 7: set avail able to slot
                service.slots = available;
            })
            
            res.send(services);
        })

        /**
         * API Naming Convention
         * app.get('/booking') // get all boking in this collection. or get more than one or by filter
         * app.get('/bookign/:id') // get a sprcific booking
         * app.post('booking') add a new booking
         * app.patch('booking/:id')//
         * app.delete(bookign/:id) //
         */

        app.get('/booking', async(req, res) =>{
            const patient = req.query.patient;
            const query = {patient: patient};
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

        app.post('/booking', async(req, res) =>{
            booking = req.body;
            const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}
            const exists = await bookingCollection.findOne(query);
            if(exists){
                return res.send({success: false, booking: exists})
            }

            const result = await bookingCollection.insertOne(booking);
            return res.send({success: true, result});

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