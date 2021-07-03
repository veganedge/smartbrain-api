const express = require('express');
const bcrypt = require('bcrypt-nodejs');  //hashing passwords to securely store in smartbrain database (db)
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg', //postgresql
    connection: {
        connectionString : process.env.DATABASE_URL, //heroku hosted database
        ssl: true,
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> { res.send('success') })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) }) 
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// maybe add app.put('/profile/:id') to update user info
// maybe add app.delete('/profile/:id') to delete user

app.listen(process.env.PORT || 3000, () => {
    console.log("app is running on port:",process.env.PORT);
})