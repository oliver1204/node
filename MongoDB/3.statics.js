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
/** 
pointsSchema.statics.findByName = function(userName) {
  return this.findOne({userName})
}

let Point = conn.model('Point', pointsSchema);

(async () => {
  let res = await Point.findByName('123')
  console.log(res)
})();
*/

pointsSchema.methods.findByName = function() {
  return this.model('Point').findOne({userName: this.userName})
}

let Point = conn.model('Point', pointsSchema);

(async () => {
  let res = await new Point({userName: '123'}).findByName();
  console.log(res)
})();