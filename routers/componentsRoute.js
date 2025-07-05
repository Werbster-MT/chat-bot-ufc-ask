const express = require('express');
const router = express.Router();

router.get('/userCard', (req, res) => {
  res.render('components/userCard'); 
});
router.get('/sideBar', (req, res) => {
  res.render('components/sideBar'); 
});
router.get('/sideBarButton', (req, res) => {
  res.render('components/sideBarButton'); 
});


module.exports = router;
