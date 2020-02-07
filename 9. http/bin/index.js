#! /usr/bin/env node

// 解析用户参数
const progarm = require('commander');
const Server = require('../4. state-server');

let config = {
  '-p, --port <value>' : 'set my-http-server port',
  '-d, --dir <dir>' : 'set my-http-server directory',
};

Object.entries(config).map(([key, value]) => {
  progarm.option(key, value);
})
progarm.name('static-http').usage('<options>');
progarm.on('--help', () => {
  console.log('Example:');
  console.log('  $ static-http --port 3000');
})

let obj = progarm.parse(process.argv);
let defaultConfig = {
  port: 3000,
  dir: process.cwd(),
  ...obj
}

let server = new Server(defaultConfig);
server.start();