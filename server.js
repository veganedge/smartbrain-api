const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
    const { email, name, password } = req.body;
    db('users')
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
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('user not found');
    }
})

// maybe add app.put('/profile/:id') to update user info
// maybe add app.delete('/profile/:id') to delete user

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('user not found');
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})