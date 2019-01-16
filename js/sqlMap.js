// dao/userSqlMapping.js
// CRUD SQL语句
var sqlMap = {
    insert:'INSERT INTO info_test(id, data1, data2, data3, data4) VALUES(0,?,?,?,?)',
    query: 'select * from info_test where 1=1'
};
 
module.exports = sqlMap;