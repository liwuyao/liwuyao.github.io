
function Map() {
	this.width = 300;
	this.height = 500;
	this.element = document.querySelector('.game-box');
} 

// 游戏角色构造函数
function Role(options) {
	if (!options)
		return this;
	this.width = options.width;
	this.height = options.height;
	this.x = options.x;
	this.y = options.y;
	this.bottom= options.bottom;
	this.element = null; // DOM 元素
	this.img = options.img;
	this.map = options.map || null; // 描述当前游戏角色所在地图
}

// 初始化方法
Role.prototype.init = function(){
	// 创建角色使用的 DOM 元素对象
	var _img = this.element = document.createElement("img");
	// 设置元素节点的 src 属性
	_img.src = this.img;
	// 将当前角色DOM元素对象添加到页面显示
	this.map.element.appendChild(_img);
	// 设置 _img 元素的CSS样式
	css(_img, {
		width : this.width + "px",
		height : this.height + "px",
		position : "absolute",
		top : this.y + "px",
		left : this.x + "px",
		bottom:this.bottom + "px"
	});
}


function Self(options) {
	var defaultOptions = {
		width : 50,
		height : 50,
		img:"image/dog.png",
		x : 70,
		y : 450,
		hp : 1000
	};
//	this.score=options.score;
	if (options) {
		for (var attr in options) {
			defaultOptions[attr] = options[attr];
		}
	}
//	console.log(defaultOptions);
	// 继承 Role 属性
	Role.call(this, defaultOptions);
	// 私有的属性
	this.hp = defaultOptions.hp;
}

Self.prototype = new Role();
//小狗私有方法 跳
//记录狗的高度
var dogY;
var jumpTime;
var jumpStatu=true;
var times=0;
Self.prototype.jump=function(){
	if(jumpStatu){
		clearInterval(dogDownTime);
		var elm = this.element
		var y=dogY;
		jumpTime=setInterval(()=>{
			times++;
			y -= 1;
			dogY=y;
			css(elm, {
			top : y + "px"
		 });
		},1)
		jumpStatu = false;
	}
}
//落下
var dogDownTime;
var score;
var jumpNum;
var catNums;
Self.prototype.dogDown=function(){
	if(!jumpStatu){
		clearInterval(jumpTime);
		jumpStatu = true;
		var elm = this.element
		var y=dogY;
		var oldY = this.y 
		var time = times*20;
		dogDownTime=setInterval(()=>{
			y+=1;
			dogY=y;
			if(y === oldY){
				y = oldY;
				jumpNum++
//				console.log("c"+catNum)
//				console.log("j"+jumpNum)
//				if(jumpNum>=catNums){
//					score = catNums;
//				}else{
//					score = jumpNum;
//				}
				clearInterval(dogDownTime);
//				scoreElem.innerHTML = "得分："+ score;
			}
			css(elm, {
			top : y + "px"
			});
		},1)
	}
}

//创建障碍物
function obstacle(options){
	var defaultOptions = {
		width : 50,
		height:50,
		img:"image/cat-img/cat_01.png",
		x : 300,
		bottom: 0,
		value:0
	};
	if (options) {
		for (var attr in options) {
			defaultOptions[attr] = options[attr];
		}
	}
	Role.call(this, defaultOptions);
	this.value = defaultOptions.value;
}
// 继承方法
obstacle.prototype = new Role();
//障碍物的私有方法  动画
obstacle.prototype.animation=function(){
	var elm = this.element;
	var width = this.element.offsetWidth;
	var height = this.element.clientHeight;
	var scoreElem = document.getElementById('score');
	var x = this.x;
	var move=setInterval(()=>{
		x -= 1;
		css(elm, {
			left : x + "px"
		});
		if(x<-this.width){
			clearInterval(move);
			if(elm){
				this.map.element.removeChild(elm);
			}
		}
		var limitY = dogY - this.y
		if(x< 120  && x >70-this.width  && limitY >= -_self.height && limitY <= this.height){
			clearInterval(move);
			clearInterval(creatObstacle);
			clearInterval(dogDownTime);
			clearInterval(jumpTime);
			if(statu){
				var div = document.createElement('div')
				div.id="over";
				div.innerHTML='GAME OVER';
				div.onclick=function(){
					start();
				};
				this.map.element.appendChild(div);
				this.map.element.removeChild(_self.element);
				statu = false;
			}
		}
		if(x==70-this.width){
			catNums ++;
			score++;
			scoreElem.innerHTML = "得分："+ score;
		}
	},10)
//	geme over 函数
}



var _self;
var creatObstacle;
var statu = false;
var ground = document.getElementById("back-ground");
var mapWidth;
var groundTime;
var catNums;
var catImgs=[
	{src:"image/cat-img/cat.png",width:50,height:50,value:1},
	{src:"image/cat-img/cat_01.png",width:50,height:60,value:0},
	{src:"image/cat-img/cat_02.png",width:20,height:30,value:0},
	{src:"image/cat-img/cat_03.png",width:70,height:80,value:0},
	{src:"image/cat-img/cat_04.png",width:100,height:110,value:0},
	{src:"image/cat-img/cat_05.png",width:10,height:20,value:0}
];
function start(){
	jumpNum=0;
	catNums=0;
	score=0;
	statu = true;
	clearInterval(jumpTime);
	clearInterval(groundTime);
	jumpStatu=true;
	document.getElementById('score').innerHTML ="得分：0"
	var _map = new Map();
		_map.element.innerHTML="";
	    mapWidth=_map.element.offsetWidth;
	var mapHeight= _map.height;
	// 创建自己的飞机对象
	_self = new Self();
	// 建立飞机对象与地图的关联关系
	_self.map = _map;
	score = 0;
	// 初始化显示地图
	_self.init();
	dogY = _self.y;
//	背景动画
	backGroundAnimation();
	
//	创建障碍物
    creatObstacle=setInterval(()=>{
    	var catImgNum = Math.floor(Math.random()*6);
    	var catInformation= catImgs[catImgNum]
//  	var catNum = Math.floor(Math.random()*5);
    	var cat = new obstacle();
    	cat.map = _map;
    	cat.img = catInformation.src;
//  	var wh= randWidthHeight[catNum]
    	cat.width=catInformation.width;
    	cat.height=catInformation.height;
    	var catY = Math.floor(Math.random()*(mapHeight-cat.height));
    	cat.y = catY;
    	cat.init();
    	cat.animation();
    },1000)
	document.onkeypress=function(e){
		var event = e || event;
		 event.preventDefault();
		var code = event.keyCode
		if(code === 32){
			_self.jump();
			document.onkeyup=function(){
				_self.dogDown();
			}
		}
	}
}

//背景图动画
 function backGroundAnimation(){
 	var imgWidth = document.querySelectorAll("#back-ground img")[0].offsetWidth;
 		var groundwidth = imgWidth*2
 		css(ground, {
				width : groundwidth+ "px"
			});
		var groundX=0;
		groundTime=setInterval(()=>{
			groundX--;
			css(ground, {
				left : groundX + "px"
				});
			if(groundX <= -imgWidth){
				groundX = 0;
			}
		},10)
 }
//工具
function css(element, attr, value) {
	// 获取
	if (typeof attr === "string" && !value)
		return window.getComputedStyle 
				? getComputedStyle(element)[attr]
				: element.currentStyle[attr];
	// 设置CSS样式
	if (typeof attr === "string" && value)
		element.style[attr] = value; // 使用内联样式设置CSS
	else if (typeof attr === "object") {
		for (var prop in attr) {
			element.style[prop] = attr[prop];
		}
	}
}

