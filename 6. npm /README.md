### nvm 切换版本
```js
nvm --version
nvm install <version>
nvm use  <version>
nvm install <version>
```

### 创建自己的全集包

- package.json 命令生成
- npm init - y
- npm link 在全局npm 下做一个快捷键

```json
// package.json
"name": "my",
....

"bin": {
  "my": "./bin/index.js"
}
```

```js
// bin/index.js

#! /usr/bin/env node
require('../main.js');
```
`#! /usr/bin/env node` 为固定写法，指执行的语言环境

命令行中执行`npm link `再运行 `my`则可以启动全局npm包了。
命令行中执行`npm unlink `取消全局npm包了。

### 本地包
- devDependencies

  > 只在开发中使用的包，安装时 npm install <packageName> --save-dev(-D)
- dependencies
	> 开发和上线后的都需要的包，安装时直接 npm install <packageName>
- 当版本有冲突时，可以`npm audit fix -f` 强制修复
- bundledDependencies 
	> 当我们的npm 包需要打包的时候，如果package.json中的`bundledDependencies: []`,命令行中`npm pack`后 `node_modules` 不会被打如压缩包内。
- peerDependencies
	> 同等依赖，`npm install`时，不会被自动安装，但是会提示用户手动去安装的包

### npm 版本管理

例如： webpack: "5.1.2"

- 5: 项目的大版本
- 1: 新增的功能版本迭代
- 2: 修复bug版本迭代

`git init` 创建git仓库后，`npm version major `更改项目的大版本号的同时，也会给git 增加一个tags。

```bash
npm version [<newversion> | major | minor | patch ]
```
### script 脚本
- npm run 的功能是， 将当前文件夹下的 `node_modules`的 `bin` 目录放到path 环境中，如果run 后面有命令，会执行对应的命令，这个执行的命令在`bin` 目录下可以直接执行。

### 发包
- 1. 先进入到要发包的文件夹中
- 2. 配置忽略文件 `.npmignore`
- 3. 检查版本和名称
- 4. 切换到官网中发布`nrm use npm`
- 5. 登录npm账号密码
  - npm addUser
- 6. 发布 `npm publish`
- 7. 撤销发布 `npm ubpublish --forces`
