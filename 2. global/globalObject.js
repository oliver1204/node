
const program = require('commander');

// 1. 追加参数信息
program.on('--help', function() {
  console.log('--help node program xxx');
})

// 2. 自动配置属性
program.option('-a,--action <action>')
program.option('-p,--port <action>', 'set port')

// 3. 自动配置对应的功能
/**
 * 比如在使用， create react app 时，
 * 我们输入命令， create react app，
 * 既可以自动创建一个初始化项目，
 * 用的就是此功能
 */
// node ./global/globalObject.js create
program
.command('create')
.action(function() {
  // 可以去git 仓库拉取代码
  console.log('program create')
})

// 4. 解析参数
// node ./global/globalObject.js --port 4000 --help 
let argv = program.parse(process.argv);
console.log(argv.args)
console.log(argv.port)

