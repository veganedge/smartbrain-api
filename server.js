const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');

const db = knex({
    client: 'pg', //postgresql
    connection: {
        host : '127.0.0.1', //localhost
        user : '',
        password : '',
        database : 'smartbrain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '100',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '101',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res)=> {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('no registered users with that email and password combination ');
    }
}) 

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;     //registers new user on Front End and logs them in.
    db('users')                                     //not working while trying to register through Postman, throws error.
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
    })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register')); 
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
})

// maybe add app.put('/profile/:id') to update user info
// maybe add app.delete('/profile/:id') to delete user

app.put('/image', (req, res) => {
    const { id } = req.body;
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning(entries)
   .then(entries => {
       res.json(entries[0]);
   })
   .catch(err => res.status(400).json('unable to get entry count'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})