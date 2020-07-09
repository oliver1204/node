/**
 * 1. 将路径处理为绝对路径
 * 2. new module 创建模块 -- 根据文件名来创建，包含属性 exports id 等
 * 3. 读取文件，每增加一个文件，函数内部需要返回module.export
 * 4. 让函数执行
 */
const path = require('path');
const fs = require('fs');
const vm = require('vm');

class Module {
  constructor(id) {
    this.id = id;
    this.exports = {};
  }
  static get catch() {
    return {};
  }
  static get _extension() {
    return {
      '.js': (module) => {
        const script = fs.readFileSync(module.id, 'utf8');
        let fnStr = Module.wrapper[0] + script + Module.wrapper[1];
        let fn = vm.runInThisContext(fnStr);
        let exports = module.exports;
        // 不直接fn() 是为了不改变this指向
        fn.call(
          exports,
          exports,
          myRequire,
          module,
          module.id,
          path.dirname(module.id)
        );
      },
      '.json': (module) => {
        const json = fs.readFileSync(module.id, 'utf8');
        module.exports = JSON.parse(json);
      },
    };
  }
  static get wrapper() {
    return [
      '(function (exports, require, module, __filename, __dirname) { ',
      '\n});',
    ];
  }
}

function resolveFilename(filename) {
  let filePath = path.resolve(__dirname, filename);
  let isExists = fs.existsSync(filePath);

  // 带后缀的完整路径
  if (isExists) {
    return filePath;
  } else {
    let ext = Object.keys(Module._extension);

    for (let i = 0; i < ext.length; i++) {
      let completePath = filePath + ext[i];
      if (fs.existsSync(completePath)) {
        return completePath;
      }
    }

    throw new Error('module not fund');
  }
}

function tryModuleLoad(module) {
  // 获取文件后嘴
  let extname = path.extname(module.id);
  Module._extension[extname](module);
}

function myRequire(filename) {
  // 1. 将路径处理为绝对路径
  let id = resolveFilename(filename);
  // 2. 如果缓存中有则从缓存中读取；
  let catchModule = Module.catch[id];
  if (catchModule) {
    return catchModule.exports;
  }
  // 3. 如果缓存中没有，new module
  let module = new Module(id);
  Module.catch[id] = module; // 模块的缓存

  tryModuleLoad(module, filename);

  return module.exports;
}

let str = myRequire('./a');
let json = myRequire('./b');
console.log(str);
console.log(json);
