/**
 * 把文件夹下的 GB2312 文件转换为 UTF-8
 */

const fs = require('fs');
const iconv = require('iconv-lite');

// 需要转换的文件夹路径
const PATH = "./txt"; 

// 获取文件夹下的所有文件
function getAllFiles(path) {
    let files = [];
    let dirList = fs.readdirSync(path);
    dirList.forEach(item => {
        let stat = fs.statSync(path + '/' + item);
        if (stat.isDirectory()) {
            files = files.concat(getAllFiles(path + '/' + item));
        } else {
            files.push(path + '/' + item);
        }
    });
    return files;
}

// 转换文件
function convertFile(file) {
    let data = fs.readFileSync(file);
    let buf = iconv.decode(data, 'gb2312');
    // 获取前10行内容
    let lines = buf.split('\n');
    let head = lines.slice(0, 10);
    // 判断是否含有乱码
    let isGB2312 = head.some(item => {
        return item.indexOf('�') !== -1;
    });
    if(!isGB2312) {
        fs.writeFileSync(file, buf); 
    }
}

// 转换文件夹下的所有文件
function convertAllFiles(path) {
    let files = getAllFiles(path);
    console.log('共记需要转换的文件: ', files.length);
    files.forEach(item => {
        convertFile(item);
    });
}

console.log('开始转换文件');
convertAllFiles(PATH);
console.log('转换完成');