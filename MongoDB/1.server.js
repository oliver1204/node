const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/point', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
conn.on('open', () => {
  console.log('数据库连接成功')
});
conn.on('error', () => {
  console.log('数据库连接失败')
});

/**
 * 需要存数据首先需要有骨架
 * 这里规定好数据的结构，如果超出的话就不会被插入
 */
let pointsSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  avatar: String,
  point: Number,
  date: Date,
  meta: {
    type: String,
    default: '备注'
  }
});
/**
 * 集合 产生一个模型
 */

let Point = conn.model('Point', pointsSchema);

/** 
// 插入一条数据
Point.create({
  userName: '123',
  avatar: 'http://wework.qpic.cn/bizmail/fxZ7zcxTXeiaUQhFZdWxG3CQnO1rnxOE7hFDOibgZfQXoLyJvticAvWdA/',
  point: 0,
  date: Date.now()
}, (err, data) => {
  console.log(err)
  console.log(data)
})
*/

/**
// 创建多条
let arr = [];
for(let i = 0; i < 10; i++) {
  arr.push({
    userName: '123',
    avatar: 'http://wework.qpic.cn/bizmail/fxZ7zcxTXeiaUQhFZdWxG3CQnO1rnxOE7hFDOibgZfQXoLyJvticAvWdA/',
    point: i,
    date: Date.now()
  })
}

(async () => {
  let datas = await Point.create(arr)
  console.log(datas)
})()
 */

/** 
// 查看一条数据 find findOne findById
(async () => {
  let data = await Point.findOne({
    point: 9
  })
  console.log(data)
})();
*/

/** 
// 分页
(async () => {
  var res = await Point.find({}).limit(2).skip(2)
  console.log(res)
})();
Point.find({}).limit(2).skip(2).exec(function(err, res) {
  console.log(res)
});
*/

/** 
// 更改
(async () => {
  var res = await Point.updateMany({
    point: 0
  }, {
    point: 100
  })
  console.log(res)
})();
*/

/** 
// 删除
(async () => {
  var res = await Point.deleteOne({
    point: 0
  })
  console.log(res)
})();
*/

