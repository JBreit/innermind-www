const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('index.hbs', {
    title: 'Inner Mind Consulting'
  });
});

module.exports = router;