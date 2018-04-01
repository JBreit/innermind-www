const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.status(200).render('index', {
    title: 'Inner Mind Consulting'
  });
});

module.exports = router;