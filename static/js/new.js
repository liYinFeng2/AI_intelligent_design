// -----------    重写    ------------------
// -----------    重写    ------------------
//定义全局变量
let original_width ;     //图片宽
let original_height ;    //图片高

let mattingRectImg_width;    //相应裁剪宽出现的图片宽高
let mattingRectImg_height;   //相应裁剪宽出现的图片高

let imgTop;                  //裁剪框相对于视口的top
let imgLeft;                 //裁剪框相对于视口的left

/* img上面是面的位置 */
let m_top;
let m_bottom;
let m_left;
let m_right;

let s_top;
let s_bottom;
let s_left;
let s_right;

let mNew_top;
let mNew_bottom;
let mNew_left;
let mNew_right;

let sNew_top;
let sNew_bottom;
let sNew_left;
let sNew_right;

let matting_rect_list = []; //请求后台返回的图片裁剪框的数组
let slogan_rect_list = [];  //请求后台返回的标题栏裁剪框的数组
let resize_k = [];          //请求后台返回的图片缩放值

let newScale;                //传递给后台新的变量值
let mouseFlag;               //鼠标滑过背景图的状态
let mouseIscClickdown;       //鼠标是否按下



let editORadd;  //判断是添加图片还是编辑
let editID;     //定义编辑图片的id

//show方法显示图对应的位置
function show(obj){
	var GetObjPos = getOffset(obj) ;
    imgTop = GetObjPos['top'];
    imgLeft = GetObjPos['left'];
    
    m_top = parseInt($(obj).attr('m_top'));
    m_bottom = parseInt($(obj).attr('m_bottom'));
    m_left = parseInt($(obj).attr('m_left'));
    m_right = parseInt($(obj).attr('m_right'));
    
    s_top = parseInt($(obj).attr('s_top'));
    s_bottom = parseInt($(obj).attr('s_bottom'));
    s_left = parseInt($(obj).attr('s_left'));   
    s_right = parseInt($(obj).attr('s_right'));  
    
    let k = $(obj).attr('k');
    
    //确定当前编辑图片的ID
    editID = $(obj).attr('id');
    
    mattingRectImg_width = original_width / k;
    mattingRectImg_height = original_height / k;
    
    //设置点击位置对应的背景图
    $(".bgBox img").css({
    	'width':original_width/k,
    	'height':original_height/k,
    	'display':'block',
    	'left':imgLeft-m_left,
    	'top':imgTop-m_top
    });
    //设置点击位置的slogan值
    $(".sloganBox").css({
    	'width':s_right-s_left,
    	'height':s_bottom-s_top,
    	'left':imgLeft+parseInt(s_left),
    	'top':imgTop+parseInt(s_top),
    	'display':'block',
    });
	
	
}



//点击裁剪框触发事件
$(document).on('click','.bannerBox img',function() {
    show(this);
});

//点击尺寸,显示图片
var sizes = [];
$(document).on('click',".setjob-content .sel-size ul li:not(.seemore)",function(){
	
	editORadd = 'add';
	editID = '';
	
	if(!$(this).hasClass("active")){
		$(this).addClass('active');
	}else{
		$(this).removeClass('active')
	}
	sizes = [];
	sizes.push($(this).attr('size'));
	for(var i = 0; i < sizes.length; i++) {
	    sizes[i] = sizes[i].split(',');
	}
	console.log('sizes',sizes);
	  // resize_k.length = 0;
	  if($(this).hasClass('active')){
	  	$('.design_container img').hide();
		$('.overlay').removeClass('design_img');
		$('.design_content').append('<div class="design_overlay"><div class="overlay design_img"></div></div>');
		UploadImgMes();
	  }else{
	  	var idname = sizes[0][0]+'_'+sizes[0][1];
	  	$(".bannerBox #"+idname).remove();
	  	$(".bgBox img").hide();
	  }
});

//确定鼠标的状态  
$(document).on('mouseover',".bgBox img",function(e){
	
		var GetObjPos = getOffset(this) ;
		//边界值确定
    	L0 = GetObjPos['left'];
    	T0 = GetObjPos['top'];
    	R0 = L0 + this.offsetWidth;
    	B0 = T0 + this.offsetHeight;
	    //范围边界确定
	    var L = L0 + 15;
	    var R = R0 - 15;
	    var T = T0 + 15;
	    var B = B0 - 15;
	    //范围确定
	    let areaL = e.pageX < L;
	    let areaR = e.pageX > R;
	    let areaT = e.pageY < T;
	    let areaB = e.pageY > B;
	    //左侧范围
	    if(areaL){this.style.cursor = 'move'; mouseFlag = 'move';}
	    //右侧范围
	    if(areaR){this.style.cursor = 'move'; mouseFlag = 'move';}
	    //上侧范围
	    if(areaT){this.style.cursor = 'move'; mouseFlag = 'move';}    
	    //下侧范围
	    if(areaB){this.style.cursor = 'move'; mouseFlag = 'move';}   
	    //左上范围
	    if(areaL && areaT){this.style.cursor = 'move'; mouseFlag = 'move';}
	    //右上范围
	    if(areaR && areaT){this.style.cursor = 'move';  mouseFlag = 'move';}
	    //左下范围
	    if(areaL && areaB){this.style.cursor = 'move';  mouseFlag = 'move';}
	    //右下范围
	    if(areaR && areaB){this.style.cursor = 'se-resize';  mouseFlag = 'se-resize';}
});

//判断鼠标在可编辑区域的事件：鼠标按下、鼠标抬起
$("#div").mousedown(function(ev){
	//console.log('鼠标按下mouseFlag = '+mouseFlag);
	ev.preventDefault();
    ev.stopPropagation();
    editORadd = 'edit';
	//移动
	if(mouseFlag == 'move'){
	    var e=window.event || ev;
	    var Mydiv=document.getElementById("div");
	    //获取到鼠标点击的位置距离div左侧和顶部边框的距离；
	    let X1=e.clientX;
	    let Y1=e.clientY;
	    var oX=e.clientX-div.offsetLeft;
		var oY=e.clientY-div.offsetTop;
	    //当鼠标移动，把鼠标的偏移量付给div
	    document.onmousemove=function(ev){
		   //计算出鼠标在XY方向上移动的偏移量，把这个偏移量加给DIV的左边距和上边距，div就会跟着移动
		   var e=window.event|| ev;
		   let X2=e.clientX;
	       let Y2=e.clientY;
	       //console.log('left='+m_left);
		   //console.log('top='+m_top);
		   // console.log('x='+parseInt(X2-X1));
		   // console.log('y='+parseInt(Y2-Y1));
		    mNew_left = m_left-parseInt(X2-X1);
		    mNew_top  = m_top-parseInt(Y2-Y1);
		    mNew_bottom = m_bottom-parseInt(Y2-Y1);
		    mNew_right  = m_right-parseInt(X2-X1);
		   
	       
		    
		    Mydiv.style.left=e.clientX-oX+"px";
            Mydiv.style.top=e.clientY-oY+"px";
	    }
	    //当鼠标按键抬起，清除移动事件
	    document.onmouseup=function(){
		   document.onmousemove=null;
		   document.onmouseup=null;
		   matting_rect_list[0] = {'top':mNew_top,'bottom':mNew_bottom,'left':mNew_left,'right':mNew_right,'e_class':'matting_point'};
		   resize_k = [];
		   console.log('matting_rect_list',matting_rect_list);
		   //slogan_rect_list[0] = {'top':sNew_top,'bottom':sNew_bottom,'left':sNew_left,'right':sNew_right};
		   UploadImgMes();
		   console.log('鼠标移动结束');
	    }
	}
	//缩放
	if(mouseFlag == 'se-resize'){
		//获取此时鼠标距离视口左上角的x轴及y轴距离
		let x1 = ev.clientX;
		let y1 = ev.clientY;
		const imgScale = mattingRectImg_width / mattingRectImg_height;
		document.onmousemove=function(ev){
		   let x2 = ev.clientX;
		   let y2 = ev.clientY;
		   let eleW = mattingRectImg_width + (x2 - x1);
		   let eleH = eleW / imgScale;
		   newScale = eleW /mattingRectImg_width;
		   var div=document.getElementById("div");
		   if(eleW != undefined){div.style.width = eleW+ 'px';}
		   if(eleH != undefined){div.style.height = eleH+ 'px';} 
	    }
	    //当鼠标按键抬起，清除移动事件
	    document.onmouseup=function(){
		   document.onmousemove=null;
		   document.onmouseup=null;
		   //鼠标送开
		   //console.log(div.width);
		   
		   matting_rect_list[0] = {};
		   slogan_rect_list[0] = {};
		   //更新k值
		   resize_k[0] = newScale;
		   UploadImgMes();
	    }
	}
				
});


//请求后台接口
function UploadImgMes() {
  var file = $('#div')[0].src;
  var titles = [];
  $('.setjob-content .title').each(function() {
    titles.push($(this).val());
  });
  $.ajax({
    url: 'https://sou.api.autohome.com.cn/ai/v1/aidesign',
    type: "post",
    dataType: 'json',
    data: JSON.stringify({
      'img' : file,     //输出原图
      'banner_para' : {
	  'titles_list' : titles,   //文案列表
	  'size_list' : sizes,
	    'logo_type' : '',                         //logo 类型  
	    'matting_rect_list' : matting_rect_list,  //裁切矩形
	    'slogan_rect_list' : slogan_rect_list,    //slogan 矩形
	    'font_type_list' : '',                    //字体类型
	    'font_size_list' : '',                    //字体大小
	    'title_color_list' : '',                  //字体颜色
	    'adder_sreen_list' : '',                  //加底幕
	    'resize_k_list' : resize_k,               //缩放倍数
	    'txt_sp_list' : ''                        //文案起始位置
      }
    }),
    success: function(res) {
      
      console.log(res);
      var img_base;
      if(res.base64_image_list) {
        for(var i = 0; i < res.base64_image_list.length; i++) {
          img_base = res.base64_image_list[0].replace('/\+/g','2B%');
        }
      }
      let m_top = res.matting_rect_list[0]['top'];
      let m_bottom= res.matting_rect_list[0]['bottom'];
      let m_left =res.matting_rect_list[0]['left'];
      let m_right= res.matting_rect_list[0]['right'];
      
      let s_top = res.slogan_rect_list[0]['top'];
      let s_bottom = res.slogan_rect_list[0]['bottom'];
      let s_left = res.slogan_rect_list[0]['left'];
      let s_right = res.slogan_rect_list[0]['right'];
      let k = res.resize_k_list[0];
      
      let id = sizes[0][0]+'_'+sizes[0][1];
      
     	
     if(editORadd == 'add' && editID == ''){
     	var html = $(".box_container").html();
	  	html += '<div class="bannerBox">'+
	  	          '<img id="'+id+'" src="data:image/jpeg;base64,'+ img_base +'" m_top="'+m_top+'" m_bottom="'+m_bottom+'" m_left="'+m_left+'" m_right="'+m_right+'" '+
	  	          's_top="'+s_top+'" s_bottom="'+s_bottom+'" s_left="'+s_left+'" s_right="'+s_right+'" k="'+k+'">'+
	  	          '</div>';
	  
	  	$(".box_container").html(html);
	  	$(".bgBox img").hide();
     }else if(editORadd == 'edit'){
     	$('#'+editID).attr('src',"data:image/jpeg;base64,"+ img_base);
     	$('#'+editID).attr('m_top',m_top);
     	$('#'+editID).attr('m_bottom',m_bottom);
     	$('#'+editID).attr('m_left',m_left);
     	$('#'+editID).attr('m_right',m_right);
     	
     	$('#'+editID).attr('s_top',s_top);
     	$('#'+editID).attr('s_bottom',s_bottom);
     	$('#'+editID).attr('s_left',s_left);
     	$('#'+editID).attr('s_right',s_right);
     	$('#'+editID).attr('k',k);
     	
     	var obj = $('#'+editID);
     	show(obj);
     }
    },
    error: function(res) {
      console.log('错误信息',res);
    }
  });
}


//上传图片事件
$(".upload-file").on("change","input[type='file']",function(){
  var filePath = $(this).val();
  if(filePath.indexOf("jpg") != -1 || filePath.indexOf("png") != -1){
    var arr = filePath.split('\\');
    var fileName = arr[arr.length-1];
    $(".filename").val(fileName);
  }else{
    alert("您上传文件类型有误!");
    return false; 
  } 
});

$("#upload").change(function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    compress(this.result);
  };
  reader.readAsDataURL(this.files[0]);
});


function compress(res){
	var that = this;
    var img = new Image(),
        maxW = 1000;
    img.onload = function () {
      var cvs = document.createElement('canvas'),
        ctx = cvs.getContext('2d');
      if (img.width > maxW) {
        img.height *= maxW / img.width;
        img.width = maxW;
      }
      // $('.design_img').css('height',img.height);
      cvs.width = img.width;
      cvs.height = img.height;
      
      original_width = img.width;
      original_height = img.height;

      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataUrl = cvs.toDataURL('image/jpeg', 1);
      $("#div").attr("src", dataUrl);
    };
    img.src = res;
}





//公用方法计算传入的对象相对于视口的位置
function getOffsetRect(elem) {
     var box = elem.getBoundingClientRect()
     var body = document.body
     var docElem = document.documentElement
     var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
     var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
     var clientTop = docElem.clientTop || body.clientTop || 0
     var clientLeft = docElem.clientLeft || body.clientLeft || 0
     var top  = box.top +  scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft
     return { top: Math.round(top), left: Math.round(left) }
 }
function getOffset(elem) {
     if (elem.getBoundingClientRect) {
         return getOffsetRect(elem)
     } else { // old browser
         return getOffsetSum(elem)
     }
}