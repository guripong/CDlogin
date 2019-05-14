var express = require('express');
const mysql = require('promise-mysql');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  res.redirect('/login');
});

router.get('/login', function (req, res, next) {

  res.render('index', {
    title: 'AI학습로그인',
    state_msg: '다고르고 로그인해주세요'
  });

});

router.post('/logout', function (req, res, next) {
  console.log('확인:', req.body);
  var login_campus = req.body.login_campus;
  var login_device = req.body.login_device;
  var login_id = req.body.login_id;

  var sql;
  mysql.createConnection(config).then(function (conn) {
    sql = `update EDUAI.CDL_temp_campus_device set using_user_id="EMPTY" where campus_name="` + login_campus + `" and device_name="` + login_device + `";`;
    connection = conn;
    console.log(sql);
    return conn.query(sql);
  }).then(function (results) {
    results = JSON.parse(JSON.stringify(results));
    connection.end();
    console.log('results',results);
  
    if (results.message.split(' ')[5] == '1') {
      return res.json({
        "success": true,
      });
    }
    else {
      return res.json({
        "success": false,
      });
    }
  });

});


router.post('/login', function (req, res, next) {
  console.log(req.body.login_campus);
  var login_campus = req.body.login_campus;
  var login_device = req.body.login_device;
  var login_id = req.body.login_id;
  var login_pw = req.body.login_pw;
  console.log('캠퍼스:', login_campus);
  console.log('장비:', login_device);
  console.log('아미디:', login_id);
  console.log('로그인:', login_pw);
  //캠퍼스랑 디바이스가 일치하면

  //id pw 확인 일치하면 (이미 있어야함)
  //SELECT idx FROM EDUAI.CDL_temp_id_pw where id='john.so' and pw='12342';

  var sql;
  mysql.createConnection(config).then(function (conn) {
    sql = `SELECT idx FROM EDUAI.CDL_temp_id_pw where id="` + login_id + `" and pw="` + login_pw + `";`;
    connection = conn;
    return conn.query(sql);
  }).then(function (results) {
    results = JSON.parse(JSON.stringify(results));
    results = results[0];
    console.log(results);


    if (results) {
      sql = `update EDUAI.CDL_temp_campus_device set using_user_id="` + login_id + `" where campus_name="` + login_campus + `" and device_name="` + login_device + `";`;
      return connection.query(sql);
    }
    else {
      return -1;
    }
  }).then(function (results) {
    connection.end();
    if (results == '-1') {
      res.render('index', {
        title: 'AI학습로그인',
        state_msg: '로그인실패'
      });
    }
    else {
      results = JSON.parse(JSON.stringify(results));
      console.log('바뀐컬럼:', results.message.split(' ')[5]);
      if (results.message.split(' ')[5] == '1') {
        res.render('logout', {
          title: 'AI학습로그아웃',
          login_campus: login_campus,
          login_device: login_device,
          login_id: login_id,

          state_msg: '사용끝나고 로그아웃하세요',
        });
      }
      else {
        res.render('logout', {
          title: 'AI학습로그아웃',
          login_campus: login_campus,
          login_device: login_device,
          login_id: login_id,

          state_msg: '사용끝나고 로그아웃하세요\n 그런데오류가 있어요! 이전사람이 로그아웃을 안하셨던거 같네요',
        });
      }
    }
  });

  //실시간DB에 업데이트쳐줌
});

var config = {
  host: '125.60.70.36',//'10.0.0.108,53380',
  port: '43306',
  user: 'app_eduai',
  password: 'Dpebdpdldkdl12%#%',
  database: 'EDUAI',
  multipleStatements: true,
};

module.exports = router;
