// 1、搭建成功
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const formidable = require('formidable');
// var http = require('http').Server(app);
var path = require('path');
const fs = require('fs');

var server = app.listen(8085, function () {
  var host = server.address().address
  var port = server.address().port
//   http://127.0.0.1:8085/用这个打开
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})

app.use(bodyParser.urlencoded({ extended: false,limit:'100Mb' }))
app.use(express.static(__dirname));
const setHeader =function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    return next();
}

// 2、静态文件功能
app.use('/public', express.static('public'));

// get请求
app.get('/', function (req, res) {
    res.send('这是在8085端口啊,这个就是登录界面');
 })
//  post请求
app.post('/', function (req, res) {
    console.log("主页 POST 请求");
    res.send('Hello POST');
 })
//  表单提交
 app.get('/process_get',function(req,res){
     var response = {
         "first_name" :req.query.first_name,
         "last_name" :req.query.last_name
     }
     res.end(JSON.stringify(response));
 })

//  文件上传

app.post("/upload",setHeader,(req,res)=>{
    let type = req.body.type || req.query.type;
    let md5Val = req.body.md5Val ||req.query.md5Val ;
    let assettype = req.body.assettype || req.query.assettype;
    let name = req.body.name || req.query.name;
    let remark = req.body.remark || req.query.remark;
    let uploadDir =`${__dirname}/data/${name}`;
    let uploadDir1 = `${__dirname}/data/${name}/${assettype}`;
    let uploadDir2 = `${__dirname}/data/${name}/${assettype}/${assettype}`;
    let uploadDir11 = `${__dirname}/data/${name}/${assettype}/hh.png`;

    let uploadDir3 = `${__dirname}/data/${name}/${assettype}/${assettype}/${md5Val}`;
    let dirr =`${__dirname}/data/${name}/${assettype}/info.json` 
    if(type==='check' || type === 'pic'){
        fs.mkdir(uploadDir3,{recursive:true},(err)=>{
            if(remark !== undefined){
                var datafile = {
                        info:remark
                }                            
                var content = JSON.stringify(datafile)
                    fs.writeFile(dirr,content,(err)=>{
                       if(err){
                            return err
                        }
                                            //  成功
                        console.log('创建成功')
                    })
                }
                if(type === 'pic'){
                    let filename = req.query.filename;
                    console.log(filename,'----------------')
                    let form = formidable({
                        uploadDir: uploadDir1,
                       });
                       form.parse(req,(err,fields,files)=>{
                           if(err){      
                               throw err                        
                          }
                          let newpath =  `${__dirname}/data/${name}/${assettype}/${filename}`;
                          fs.rename(files.picform.filepath,newpath,(err)=>{
                              if(err){
                                  res.json({
                                      info:'图片命名失败'
                                  })
                              }
                          })      
                       })
                }               
            if(err){
                throw err
            }else{
                return res.json({
                        code:200,
                        msg:'get_succ',
                        data:{
                        info:'获取成功',
                        type:'upload',
                        index:0,
                        }
                        })
            }
        })
}else if(type==='upload'){
    let total = req.query.total;
    console.log(total)
    let current = req.query.current;
    let uploadDir_upload = `${__dirname}/data/${name}/${assettype}/${assettype}/${md5Val}`;
    console.log(uploadDir_upload,'uploadDir_upload')
    fs.access(uploadDir_upload, fs.constants.F_OK, function(err){
        console.log(err)
        if(err){
            return res.json({
                code: 101,
                msg: 'get_fail',
                data: {
                    info: '获取失败！',
                    err
                }
            })
        }
        upload(uploadDir_upload,res,req,md5Val,current,name,assettype);
    });
}else if(type==='merger'){
    let filename = req.body.filename || req.query.filename;
    let newPath = `${__dirname}/data/${name}/${assettype}/${assettype}/${filename}`;
    meger(uploadDir3, newPath).then(function (data) {
         if (data.code == 200) {
             res.json({
                code: 200,
                msg: 'get_succ',
                data: {
                    info: '文件合并成功！',
                    url: newPath
                }
            })
        } else {
             res.json({
                code: 101,
                msg: 'get_fail',
                data: {
                    info: '文件合并失败！',
                    err: data.data.error
                }
            })
        }
         deleteFolderRecursive(uploadDir3);
         uncompress(newPath)
    })
}
});
function upload(uploadDir,res,req,md5Val,current,name,assettype) {
    let form = formidable({
        multiples: true,
        uploadDir: uploadDir,
        maxFileSize:600*1024*1024
    });
     form.parse(req, (err,fields, files)=> {
         if (err) {
             console.log(err)
             return res.json(err);
         }
         let newPath = `${__dirname}/data/${name}/${assettype}/${assettype}/${md5Val}/${current}`;
         fs.rename(files.file.filepath, newPath, function(err) {
             if (err) {
                 return res.json({
                     code: 101,
                     msg: 'get_fail',
                     data: {
                         info: '获取失败！',
                         err
                     }
                 });
             }
             return res.json({
                 code: 200,
                 msg: 'get_succ',
                 data: {
                     info: 'upload success!',
                     index: Number(current)+1
                 }
             })
         })

     })
}
function meger(filePath,newPath) {
     return new Promise((resolve, reject) => {
         let files = fs.readdirSync(filePath);
         files.sort(function (a,b) {
             return Number(a)> Number(b);
         });
         let newFile = fs.createWriteStream(newPath);
         main();
         function main (index = 0) {
             let currentFile = filePath + '/'+files[index];
             let stream = fs.createReadStream(currentFile);
             stream.pipe(newFile, {end: false});
             stream.on('end', function () {
                 if (index < files.length - 1) {
                     index++;
                     main(index);
                 } else {
                     newFile.end();
                     resolve({code: 200});
                 }
             })
             stream.on('error', function (error) {
                 resolve({code: 102, data:{error}})
             })
         }
     })
}
function deleteFolderRecursive(url) {
    let files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {
            let curPath = path.join(url, file);
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);

    } else {
        console.log("给定的路径不存在，请给出正确的路径");
    }
}
// 解压
function uncompress(sourcePath) {
    let dest =path.dirname(sourcePath);
    let ext = path.extname(sourcePath);
    switch (ext) {
        case '.zip':
            compressing.zip.uncompress(sourcePath, dest);
            break;
        case '.tar':
            compressing.tar.uncompress(sourcePath, dest);
            break;
        case '.tgz':
            compressing.tgz.uncompress(sourcePath, dest);
            break;
        case '.gz':
            compressing.gzip.uncompress(sourcePath, dest);
            break;
        default:
            console.log(ext)
    }

}

