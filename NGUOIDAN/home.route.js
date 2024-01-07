const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    res.render('home');
});

router.get('/', (req, res) => {
    res.render('home');
});
module.exports = router;
