const express = require('express');

const router = express.Router();

// middleware

// endpoints

// /api/products/
router.get('/', (req, res) => {
  res.send(`GET /api/products/${req.params.id}`)
});

module.exports = router;
