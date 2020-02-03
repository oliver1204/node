## node 中的模块
- 模块的分类 ES6module, CommonJs, CMD, AMD, UMD
  - CommonJs规范
    - 一个文件就是一个模块
    如果模块想给别人用， 使用 `module.exports`、`exports`
    - 如果想使用这个模块，可以使用 require（同步读取文件）
  - 模块的查找规范
    - 第三方模块 module.paths
    - 如果文件和文件夹重名， 先取文件，文件取不到，找文件夹

### require 的实现
require.js