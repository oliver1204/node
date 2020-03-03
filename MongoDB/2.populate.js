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

let productShema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  point: Number,
  exchangDate: Date,
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Point'
  } // 兑换商品的用户信息
});
let Point = conn.model('Point', pointsSchema);
let Product = conn.model('Product', productShema);
// 通过 ref 引用其他表 通过 populate 添加其他表的值

(async () => {
  let userId = '5e562ca96433663221a14981';
  let result = await Product.findById(userId).populate('user');
  console.log(result);
})();

