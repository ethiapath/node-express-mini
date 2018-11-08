const express = require('express');
const db = require('../data/db.js');

const configureMiddleware = require('./middleware.js');
const productRouter = require('../products/productRouter.js');

const server = express();

configureMiddleware(server);

server.get('/', (req, res) => {
  res.send('Hello there');
});

const greeter = require('./greeter.js');

server.get('/greet', (req, res) => {
  res.json({ hello: 'stranger' });
});

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

server.get('/api/user/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if(user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({message: 'sorry resource not found'});
      }
  })
  .catch(err => {
    res.status(500).json({message: 'We failed you', err: err}); 
  });
});

server.post('/api/users', async (req, res) => {
  console.log(req.body )
  try {
    const userData = req.body
    const userId = await db.insert(userData);
    const user = await db.findById(userId.id);
    console.log(user)

    res.status(201).json(userId);

  } catch (error) {
    res.status(500).json({ message: 'error creating user', error})
  }

});

server.put('/api/users/:id', (req, res) => {
  console.log(req.params.id, req.body)
  db.update(req.params.id, req.body)
    .then(count => { 
      if (count) {
        res.status(200).json({ message: `${count} users updated`});
      } else {
        res.status(404).json({ message: 'error updating user', error})
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'error updating user', error})
    })
})

server.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id).then(count => {
    res.status(200).json(count); 
  }).catch(err => {
    res.status(500).json({ message: 'error deleting user' });
  })

})

server.get('/greet/:person', greeter)

module.exports = server;
