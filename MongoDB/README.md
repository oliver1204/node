## 1. 什么是MongoDB
* MongoDB 是一个基于分布式文件存储的数据库。
* MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
* MongoDB 将数据存储为一个文档，数据结构由建值对组成。MongoDB文档类似于json 对象，字段可以包含其他文档，数组以及文档数组。
## 2. MongoDB 的安装
## 2.1 使用 brew 安装

MongoDB不再是开源的了，并且已经从Homebrew中移除 #43770,  老得安装方式已经不适用了，新的安装方式如下：

https://github.com/mongodb/homebrew-brew

```bash
brew tap mongodb/brew
brew install mongodb-community
```

## 2.2 运行 MongoDB
1、首先我们创建一个数据库存储目录 /data/db：

```bash
sudo mkdir -p /data/db
```

> 如果你的数据库目录不是/data/db，可以通过 --dbpath 来指定。
> sudo mongod --dbpath=/data/db

2、启动 mongodb，默认数据库目录即为 /data/db：
sudo mongod（相当于上文中brew services start mongodb-community）

我们可以把 MongoDB 的二进制命令文件目录（安装目录/bin）添加到 PATH 路径中：(相当于Windows的环境变量，brew安装的话可省略)
export PATH=/usr/local/mongodb/bin:$PATH

3、再打开一个终端进入执行以下命令：

```bash
$ mongo
MongoDB shell version v4.0.9
connecting to: mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("3c12bf4f-695c-48b2-b160-8420110ccdcf") }
MongoDB server version: 4.0.9
……
> 1 + 1
2
> 
```

## 3. MongoDB启动与连接
启动/停止 mongodb，默认数据库目录即为 /data/db：

```bash
brew services start mongodb-community
brew services stop mongodb-community

```

手动启动 mongod
如果不需要或不需要后台MongoDB服务，可以运行：
```bash
mongod --config /usr/local/etc/mongod.conf
注意：如果不包括–config选项具有配置文件的路径，则MongoDB服务器没有默认配置文件或日志目录路径，并且将使用 /data/db.
```

关机mongod手动启动，请使用admin数据库和运行db.shutdownServer():

```bash
mongo admin --eval "db.shutdownServer()"
```

## 4. MongoDB的基础概念

* 数据库：MongoDB的单个实例可以容纳多个独立的数据库，比如一个学生管理系统就可以对于一个数据实例 最大：2G
* 集合：数据库是由集合组成的，一个集合用来表示一个实例，入学生实例
* 文档： 集合是由文档组成的，一个文档表示一条记录，比如学生张三。单个文档最大：16M

## 5. 数据库操作
### 5.1 使用数据库
```bash
use school
```

### 5.2 查看所有数据库

```bash
show databases
```
### 5.3 查看当前使用的数据库
```bash
db
```
### 5.4 删除数据库
```bash
db.dropDatebase()
```

## 6. 操作集合
### 6.1 查看数据库下的集合
```bash
show collections
```
### 6.2 创建集合
```bash
db.createCollection('user')
```
### 6.3 删除集合
```bash
db.user.drop()
```

## 7. 增加、删除、查看、更新文档

### 7.1 增加文档
#### 7.1.1 insert
```bash
db.user.insert({name: 'olifer', age: '12'})
```
#### 7.1.2 OblectId 构成

OblectId是文档类型的主键（id），OblectId 是由12个字节的 bson 类型字符串，按照字节顺序，依次代表：
- 4个字节：unix时间戳
- 3个字节：运行MongoDB的机器
- 2个字节：生成此ID的进程
- 3个字节：由一个随机数开始的计数器生成的值

### 7.2 删除文档
```bash
db.user.remove()
```
默认全部删除，如果需要删除某一条，添加一个 `justOne: true`

### 7.3 查看文档
#### 7.3.1 语法
```bash
db.user.find()
```
#### 7.3.2 参数
##### 7.1.2.1 查询范围
$in/$nin 等于/不等于 0和5
```bash
db.user.find({age: {$in: [0, 5]}})
db.user.find({age: {$nin: [0, 5]}})
```

$lt, $gt 大于，小于 

```bash
db.user.find({age: {$lt: 0, $gt: 5}})
```

$or: 或者关系  $in: 在范围内
```bash
db.user.find({$or:[{age: {$lt: 0, $gt: 5}}, age: {$lt: 8, $gt: 10}}]})
```
```bash
db.user.find({age: $in[0, 5]})
```

##### 7.3.2.2 分页排序

```bash
let currentPage = 2
let limit = 3

db.user.find().skip((currentPage - 1) * limit).limit(limit).sort({age: -1 })
```
- skip: 跳过
- limit： 限制多少条
- sort： 排序，-1倒叙 1 正序
- count： 总数

##### 7.3.2.3 控制显示谁

```bash
db.user.find({字段: 0/1})
```

### 7.4 更新文档
#### 7.4.1 语法
```bash
db.user.update(arg1, arg2, arg3)
```
#### 7.4.2 参数
##### $set 表示单独修改某一项

```bash
db.user.update({name: 'olifer'}, {$set: {age: '15'}}, {multi: true}

db.user.update({name: 'olifer'}, {$unset: {age: '15'}}, {multi: true})
```

##### $inc 自动增长, 不存在，则自动追加一条

```bash
db.user.update({name: 'olifer'}, {$inc: {age: '15'}}, {multi: true, upsert: true}
```

##### 数组的操作

- $push 添加
- $pop 删除 
- $each 添加多个项
- "属性.index" 例如： student: ['张三'， '李四']， "student.2": "王五"
- $addToSet 添加查询

## 8. 可以将命令行写到js文件时

```bash
mongo 文件名
```

## 9. 数据备份

```bash
mongodump --db point --collection user --out backup
mongrestore 文件名
```
## 10. 添加权限（添加用户）
- mongod --auth
- mongod -u olifer -p 123456 127.0.0.1:27018/admin  用户登录

## 11. node中操作mongodb 

安装npm包mongoose, 可以提供我们增删查改的功能。

```bash
npm install mongoose
```
### 11.1 增

```js
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
```

### 11.2 删

```js
(async () => {
  var res = await Point.deleteOne({
    point: 0
  })
  console.log(res)
})()
```
```js

```

### 11.3 查

#### 11.3.1 查询单条数据
```js
(async () => {
  let data = await Point.findOne({
    point: 9
  })
  console.log(data)
})();
```
#### 11.3.2 通过ID查询
```js
(async () => {
  let data = await Point.findById('5e54e4e7a580c9420aef4fd1')
  console.log(data)
})();
```
#### 11.3.3 分页查询
```js
// 分页
(async () => {
  var res = await Point.find({}).limit(2).skip(2)
  console.log(res)
})()

Point.find({}).limit(2).skip(2).exec(function(err, res) {
  console.log(res)
})
```
#### 11.3.3 连表查询

```js
// pointsSchema
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
// productShema
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
// 关联
(async () => {
  let userId = '5e562ca96433663221a14981';
  let result = await Product.findById(userId).populate('user');
  console.log(result);
})();
```

### 11.4 改

```js
// updateMany updateOne
(async () => {
  var res = await Point.updateMany({
    point: 0
  }, {
    point: 100
  })
  console.log(res)
})()
```

## 封装静态方法 statics

操作整个文档，通过所有去查询某一个

```js
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

pointsSchema.statics.findByName = function(userName) {
  return this.findOne({userName})
}

let Point = conn.model('Point', pointsSchema);

(async () => {
  let res = await Point.findByName('123')
  console.log(res)
})();
```
通过具体实例去调用

```js
pointsSchema.methods.findByName = function() {
  return this.model('Point').findOne({userName: this.userName})
}

let Point = conn.model('Point', pointsSchema);

(async () => {
  let res = await new Point({userName: '123'}).findByName();
  console.log(res)
})();
```


