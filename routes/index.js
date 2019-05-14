var express = require('express');
const mysql = require('promise-mysql');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {


  res.redirect('/login');
});

router.get('/login', function (req, res, next) {

  res.render('index', {
    title: 'Express',
    state_msg: '다고르고 로그인해주세요'
  });

});


router.post('/login', function (req, res, next) {
  console.log(req.body.login_campus);
  var login_campus =req.body.login_campus;
  var login_device =req.body.login_device;
  var login_id = req.body.login_id;
  var login_pw = req.body.login_pw;
  console.log('캠퍼스:',login_campus);
  console.log('장비:',login_device);
  console.log('아미디:',login_id);
  console.log('로그인:',login_pw);
  //캠퍼스랑 디바이스가 일치하면

  //id pw 확인 일치하면 (이미 있어야함)
  //SELECT idx FROM EDUAI.CDL_temp_id_pw where id='john.so' and pw='12342';
 

  mysql.createConnection(config).then(function (conn) {
    sql = `SELECT idx FROM EDUAI.CDL_temp_id_pw where id="`+login_id+`" and pw="`+login_pw+`";`;
    connection = conn;
    return conn.query(sql);
  }).then(function (results) {
    results=JSON.parse(JSON.stringify(results));
    console.log(results);
    connection.end();

  });

  //실시간DB에 업데이트쳐줌


  res.render('index', {
    title: 'Express',
    state_msg: '시도했음'
  });

});

var config = {
  host     : '125.60.70.87',//'10.0.0.108,53380',
  port     : '43306',
  user     : 'SW_lambda',
  password : 'L!Sokiyoung123!@#',
  database : 'EDUAI',
};

module.exports = router;
