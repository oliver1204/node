const path = require('path')
const fs = require('fs').promises
const {
  createReadStream
} = require('fs')

module.exports = (dirname) => {
  return async (ctx, next) => {
    let pathname = ctx.request.url;
    console.log(dirname, ctx);
    let absPath = path.join(dirname, pathname);
    console.log(absPath);
    
    let stats = await fs.stat(absPath)
    try {
      if(stats.isFile()) {
        ctx.set('Content-Type', 'application/json;charset=utf-8')
        ctx.body =  await createReadStream(absPath)
      } else if (stats.isDirectory()) {
        // ....
      }
    } catch (error) {
      await next()
    }
  }
}