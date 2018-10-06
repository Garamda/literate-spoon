(function(){
var childProcess = require("child_process");
var oldSpawn = childProcess.spawn;
function mySpawn(){
        console.log('spawn called');
        console.log(arguments);
var result = oldSpawn.apply(this, arguments);
return result;
}
    childProcess.spawn = mySpawn;
})();
console.log( process.env.PATH );

var express = require('express');
var router = express.Router();
var videoDir = './public/videos';
var imageDir = './assets/image';
var fs = require('fs');
const path = require('path');
var multer = require('multer')
// var PythonShell = require('python-shell');

// var options = {

// 	mode: 'text',
  
// 	pythonPath: 'C:\Users\rlaal\AppData\Local\Programs\Python\Python36\Python.exe',
  
// 	pythonOptions: ['-u'],
  
// 	scriptPath: 'C:\Users\rlaal\Desktop\SPARK\routes',
  
// 	args: ['value1', 'value2', 'value3']
  
//   };
//   PythonShell.run('test.py', options, function (err, results) {

// 	if (err) throw err;
  
  
// 	console.log('results: %j', results);
  
//   });  

let {PythonShell} = require('python-shell');
//console.log(PythonShell);

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/videos') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
	}
})
var upload = multer({ storage: storage })
//const upload = multer({ dest: 'assets/video', limits: { fileSize: 5 * 1024 * 1024 } });

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("sdfsdfs");
	var videolist = fs.readdirSync(videoDir);
	console.log(videolist);
	//videolist = filelist;
	var init_title = videolist.length>0?videolist[0]:'NO VIDEO';
	res.render('./index', {
		title: init_title,
		videoList: videolist,
		listsize: videolist.length
	});
});
// videoname을 이용한 python파일 실행 및 이미지,텍스트 정보 send
router.get('/video/:name', function(req, res){
	//1. videoname으로 videoname 보내주기
	//todo: python-shell을 통한 code 실행 ->각각의 디렉토리에 이미지 텍스트 구현 완료 되었다 가정한 개발
	
	var filename = req.params.name;
	console.log(filename);
	var videolist = fs.readdirSync(videoDir);

	//전체 이미지 이름 리스트
	var imglist = fs.readdirSync('./public/images/'+filename+'/');
	//균열 감지된 이미지 이름 리스트
	var framelist = fs.readdirSync('./public/images/'+filename+'_crack/');
	//균열 감지된 이미지 정보 이름 리스트
	var textlist = fs.readdirSync('./public/images/'+filename+'_info/');
	// var files = fs.readdirSync('C:\Users\rlaal\Desktop\frame');
	
	// console.log(videolist);
	console.log(videolist);
	console.log(imglist);
	res.render('./index', {
		title: filename,
		videoList: videolist,
		listsize: videolist.length,
		imgList: imglist,
		imglistsize: imglist.length,
		frameList: framelist,
		textList: textlist
	});
  });

router.post('/upload', upload.single('userfile'), function(req, res){
	//res.send('Uploaded! : '+req.file); // object를 리턴함
	console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
	/*PythonShell.run('/usr/local/lib/python3.5/dist-packages/tensorflow/keras/ssd_keras/crack.py', null, function (err, results) {
		if (err) throw err;
		console.log('result: %j', results);
	});*/
	res.redirect('/video/'+req.file.name.split('.')[0]);
});

module.exports = router;
