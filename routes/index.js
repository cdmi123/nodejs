var express = require('express');
var router = express.Router();
var user = require('../controller/usercontroller');
var auth = require('../middleware/checktoken');

router.post('/',user.index);
router.get('/',auth.check_token,user.get_data);
router.get('/data',user.get_data);

router.get('/single/:id',user.single_data);
router.post('/update/:id',user.update_data);
router.get('/delete/:id',user.delete_data);
router.post('/login',user.login);
router.get('/logout',user.logout);



module.exports = router;0