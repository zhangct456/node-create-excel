//	express
var express = require('express');
//	数据库方法
var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./sqlMap');
//	路由router
var router = express.Router();
//	操作文件方法
var xlsx = require('./xlsx');

var app = express();

// db使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);

router.post('/postinfo', (req, res) => {
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(err);
			return;
		}
		var data = req.body;
		var sql = $sql.insert;
		var queryData = [];
		queryData.push(data.data1);
		queryData.push(data.data2);
		queryData.push(data.data3);
		queryData.push(data.data4);
		connection.query(sql, queryData, function(err, result) {
			if(result && result.length != 0) {
				result = {
					code: 200,
					msg: '查询成功',
				};
			} else {
				result = {
					code: 500,
					msg: '查询失败'
				}
			}
			console.log("query :" + JSON.stringify(data));
			console.log("sql   :" + sql);
			console.log("data  :" + queryData);
			res.send(result);
			connection.release();
			console.log("close connection");
		});
	})
	//	数据模板
	//	var data = [
	//		{name: 'sheet1',data: [['ID','Name','Score'],['1','Michael','99'],['2','Jordan','98']]},
	//		{name: 'sheet2',data: [['AA','BB'],['23','24']]}
	//	]
	//	写文件
	//	xlsx.writeFn('./xlsx/test.xlsx', data, function(err){
	//		if(err){
	//			console.log(err);
	//		}else{
	//			console.log("已生成xlsx文件");
	//			res.send(`
	//				<h5>已生成xlsx文件</h5>
	//			`);
	//		}
	//	})
	//	var re = xlsx.readFn('./xlsx/test.xlsx')
	//	res.send(`
	//		<h5>${re}</h5>
	//	`);
});

router.get('/getinfo', (req, res) => {
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(err);
			return;
		}
		var sql = $sql.query;
		var queryData = [];
		connection.query(sql, queryData, function(err, result) {
			if(result && result.length != 0) {
				result = {
					code: 200,
					msg: '查询成功',
					data: result
				};
			} else {
				result = {
					code: 500,
					msg: '查询失败'
				}
			}
			console.log("sql   :" + sql);
			console.log("data  :" + queryData);
			console.log("result:" + JSON.stringify(result));
			//查询结果是数组，处理成excel数据的结构
			var excelData = [{
				name: 'sheet1',
				data: [['data1','data2','data3','data4']]
			}, ]
			for(var i = 0; i < result.data.length; i++) {
				excelData[0].data.push([
					result.data[i].data1,
					result.data[i].data2,
					result.data[i].data3,
					result.data[i].data4,
				])
			}
			console.log(excelData);
			//开始创建文件
			//时间戳
			var date = new Date();
			//文件名
			var fileName = "./excel/test_info" + date.getTime() + ".xlsx"
			//创建文件
			xlsx.writeFn(fileName, excelData, function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("已生成xlsx文件");
					res.send(`
						<h5>已生成xlsx文件</h5>
					`);
				}
			})
			connection.release();
			console.log("close connection");
		});
	})
})

app.use('/', router);
module.exports = app;