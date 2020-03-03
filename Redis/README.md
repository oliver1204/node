## 1. Redis 简介
Redis 是一个开源（BSD许可）的，高性能的 key- value 型数据库。内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。 

## 2. 优势
* 性能高 -- Redis读的速度110000次/s，写81000次/s
* 丰富的数据类型 -- 支持二进制的字符串、列表、哈希值、集合和有序集合等数据类型
* 原子性 -- Redis的所有操作都是原子性的，要么成功执行，要么失败不执行
* 单个操作是原子性的。多个事物也支持事物，即原子性， 通过MULTI 和 EXEC 指令包起啦
* 丰富的特效 -- Redis支持发布订阅，通知，key过期等

性能： redis > mongodb > mysql

> 分布式： 类似 nigx 转发 -- 把所有服务器当作一台服务器看待。虽然分开部署，但是提供统一的功能, redis一般用来存储 token、商户信息等简单的信息。

## 3. 安装

## 4. Redis 的基本使用方法
`keys *` 显示全部
`type` 判断类型
`flushall` 销毁群不
`expire` 设置过期时间
`ttl` 是否过期
- 字符串`set`,`get`,`getrange`,`del`,`incr`,`decr`
- 哈希表 `hset`,`hget`,`hmget`,`hgetall`,`hdel`,`hkeys`
- 连表 `lpush`,`lpop`,`lrange`,`lrem`,`lindex`
- 集合 `sadd`,`smembers`,`srem`,`sunion`,`sdiff`
- 有序列表 `zadd`,`zrem`,`zange`,`withScores`,`zcard`

