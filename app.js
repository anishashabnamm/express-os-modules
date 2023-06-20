const { log } = require('console')
const os = require ('os')

console.log("CPU:"+os.cpus());

console.log("Architecture:"+os.arch());

console.log("Platform:"+os.platform());

console.log("Total Memory:"+os.totalmem());

console.log("Free Memory:"+os.freemem());

console.log("Hostname:"+os.hostname());

console.log("Type:"+os.type());

console.log("Info:"+os.userInfo())