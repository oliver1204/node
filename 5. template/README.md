## 模版引擎的实现
常见的模版引擎有： ejs,  handlbar, underscore, jade等等，我们今天的例子都以ejs为主。

### 实现一个es6字符串解析
```js
let name = 'olifer', 
    age = 10;

console.log(`${name}今年${age}岁`); // olifer今年10岁 
```
那么对于"${name}今年${age}岁"，我们如何实现呢？没错，就是正则。

```js
str = str.replace(/\$\{(.+?)\}/g, (match, arr) => {
  return eval(arr)
})
console.log(str)
```
`template.js` 文件我们举例了ejs的用法

## 实现一个es6字符串解析
我们要实现的就是test文件的内容
主要运用到的三个方法是 ，with(){} , new Function 和 正则