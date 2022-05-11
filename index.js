const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://doctor_admin:<password>@cluster0.lovoj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get('/', (req, res) => {
  res.send('hello From Doctor Portal')
})

app.listen(port, () =>{
    console.log('Doctors App')
})