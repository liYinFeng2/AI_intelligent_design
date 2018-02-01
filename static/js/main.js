var img_base64_url;    //base64图片
var matting_rect_top,matting_rect_left,matting_rect_bottom,matting_rect_right,  //图片裁剪框距离原点上、下、左、右
    slogan_rect_top,slogan_rect_right,slogan_rect_bottom,slogan_rect_left;      //标题裁剪框距离原点(裁剪框)上、下、左、右
var resize_k = [];          //缩放倍数
var slogan_rect_list = [];  //slogan矩形数组
var matting_rect_list = []; //图片裁剪框数组

var design_mes_all = [];
var design_sign_num,design_sign_index,
    base_img_width,base_img_height;  //显示的背景图  宽、高(实时变)
    
//定义选择过的所有尺寸数组 -- 历史尺寸
var sizeArr=[];



let editORadd;//判断当前是新选择尺寸还是对其进行编辑
let editID;   //编辑的id
    

//页面初始化需要加载的方法
$(document).ready(function () {
  upload_ops.init();
});



//自定义尺寸删除
$(document).on('mouseout','.setjob-content .sel-size ul li',function(){
	  $(this).children("span:nth-child(2)").hide();
});
$(document).on('mouseover','.setjob-content .sel-size ul li',function(){
	  $(this).children("span:nth-child(2)").show();
});



let mouseFlag; //记录鼠标状态	    
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

var x0,y0,x1,y1,EW,EH,isChanging,areaL,areaR,areaT,areaB;

$(document).on('mouseenter','#resize-image',function(e){
	var obj =  document.getElementById('resize-image');
	var GetObjPos = getOffset(obj) ;
	var offsetTop = GetObjPos['top'];   //y0=GetObjPos['top'];
	var offsetLeft = GetObjPos['left']; //x0=GetObjPos['left'];
    //元素边界确定
	    var L0 = offsetLeft;
	    var R0 = offsetLeft + this.offsetWidth;
	    var T0 = offsetTop;
	    var B0 = offsetTop + this.offsetHeight;
	    //范围边界确定
	    var L = L0 + 10;
	    var R = R0 - 10;
	    var T = T0 + 10;
	    var B = B0 - 10;
	    //范围确定
	     areaL = e.clientX < L;
	     areaR = e.clientX > R;
	     areaT = e.clientY < T;
	     areaB = e.clientY > B;
	    //左侧范围
	    if(areaL){this.style.cursor = 'move'; mouseFlag = 'move';}
	    //右侧范围
	    if(areaR){this.style.cursor = 'move'; mouseFlag = 'move';}
	    //上侧范围
	    if(areaT){this.style.cursor = 'move'; mouseFlag = 'move';}    
	    //下侧范围
	    if(areaB){this.style.cursor = 'move'; mouseFlag = 'move';}   
	    //左上范围
	    if(areaL && areaT){this.style.cursor = 'nw-resize'; mouseFlag = 'nw-resize';}
	    //右上范围
	    if(areaR && areaT){this.style.cursor = 'ne-resize';  mouseFlag = 'ne-resize';}
	    //左下范围
	    if(areaL && areaB){this.style.cursor = 'sw-resize';  mouseFlag = 'sw-resize';}
	    //右下范围
	    if(areaR && areaB){this.style.cursor = 'se-resize';  mouseFlag = 'se-resize';}
	    //中间范围    
	    if(!areaL && !areaR && !areaT && !areaB){this.style.cursor = 'move';  mouseFlag = 'move';}
	        
});

  








var upload_ops = {
  init: function () {	
    this.eventBind();
  },
  eventBind: function () {
    var that = this;
    $("#upload").change(function () {
      //$("#uploadInf").html("");
      var reader = new FileReader();
      reader.onload = function (e) {
        that.compress(this.result);
      };
      reader.readAsDataURL(this.files[0]);
    });
  },
  
  compress: function (res) {
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
      base_img_width = img.width;
      base_img_height = img.height;

      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataUrl = cvs.toDataURL('image/jpeg', 1);
      $(".resize-image").attr("src", dataUrl);
    };
    img.src = res;
    $('.design_container').css({'position': 'absolute','left': '44%','top': '50%','transform': 'translate(-50%, -50%)'});
    $('.resize-container').css({'position': 'static','left': '0','top': '0'});
    $('img').show();
    $('img').css('opacity',1);
    $('.design_content').html('');
    resize_k = [];
    slogan_rect_list = [];
    matting_rect_list = [];
    design_mes_all = [];
    $('.setjob-content .sel-size ul li').each(function() {
      $(this).removeClass('active');
    });
    $(".move-line").hide();
  }
};

function addEvent(target,type,handler){
    if(target.addEventListener){
        target.addEventListener(type,handler,false);
    }
    else{
        target.attachEvent('on'+type,function(event){
            return handler.call(target,event);
        });
    }
}
var mousedownHandler = function(e){
	var ele =  document.getElementById('resize-image');
    e = e || event;
    if(e.preventDefault){
        e.preventDefault();
    }else{
        e.returnValue = false;
    }
    //IE8-浏览器阻止默认行为
    if(ele.setCapture){
        ele.setCapture();
    }
    
    //获取元素距离定位父级的x轴及y轴距离
    var GetObjPos = getOffset(ele) ;
    y0=GetObjPos['top'];
    x0=GetObjPos['left'];
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    x1 = e.clientX;
    y1 = e.clientY;
    //获取此时元素的宽高
    EW = ele.offsetWidth;
    EH = ele.offsetHeight;	    
    //按下鼠标时，表示正在改变尺寸
    isChanging = true;
}
var ss;
let eleW;
let eleH;
let eleL;
let eleT;
let D_value;
var mousemoveHandler = function(e){
	   	if(mouseFlag  == 'nw-resize' || mouseFlag  == 'ne-resize' || mouseFlag  == 'sw-resize' || mouseFlag  == 'se-resize'){
		var obj =  document.getElementById('resize-image');
		e = e || event;
        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
        //IE8-浏览器阻止默认行为
        if(obj.setCapture){
            obj.setCapture();
        }
		
		var x2 = e.clientX;
	    var y2 = e.clientY; 
	   
	    
		if(isChanging){
			// 定义图片变量
			const baseImgWidth = base_img_width;
			const baseImgHeight = base_img_height;
			const imgScale = baseImgWidth / baseImgHeight;
			
			//console.log('返回的图片的宽',base_img_width);
			//console.log('返回的图片的高',base_img_height);
			D_value  = parseInt(x2 - x1);
	        eleW = EW + (x2 - x1);
	        eleH = eleW / imgScale;
	        //base_img_width = eleW;
	        //base_img_height = eleH;
	        //范围限定
            if(parseInt(eleW) < 60){eleW = '60px';}    
            if(parseInt(eleH) < 60){eleH = '60px';}
            
           
            
            if(eleW != undefined){obj.style.width = eleW+ 'px';}
            if(eleH != undefined){obj.style.height = eleH+ 'px';}                       
            if(eleT != undefined){obj.style.top = eleT+ 'px';}
            if(eleL != undefined){obj.style.left = eleL+ 'px';} 
        } 
        
         
        
    } 
}
var mouseupHandler = function(e){
	    //鼠标抬起时，表示停止运动
	    editORadd = 'zoom';
	    if(mouseFlag  == 'se-resize' && isChanging){
	    	//console.log('原始k值resize_k',resize_k);
	    	//console.log('base_img_width = '+base_img_width+',eleW='+eleW);
            ss = base_img_width / eleW;
	    	resize_k = [];
	   		resize_k.push(ss);
	   		//console.log('拉伸后的k值resize_k',resize_k);
	   		
	   		matting_rect_list = [];
	        slogan_rect_list = [];
	    	UploadImgMes();
	    }
	    isChanging = false;
}


//裁剪图片
var resizeableImage = function(image_target) {
  // Some variable and settings
  
  var $container,
  orig_src = new Image(),
  image_target = $(image_target).get(0),
  event_state = {},
  constrain = false,
  min_width = 60, // Change as required
  min_height = 60,
  max_width = 1000, // Change as required
  max_height = 1000,
  resize_canvas = document.createElement('canvas');
  orig_src.crossOrigin = '*';  //<-- set here
  init = function() {
    // When resizing, we will always use this copy of the original as the base
    orig_src.src = image_target.src;
    // Wrap the image with the container and add resize handles
    $(image_target).wrap('<div class="resize-container"></div>');
      // Assign the container to a variable
    $container = $(image_target).parent('.resize-container');

    // Add events
    $container.on('mousedown', '.resize-handle', startResize);
    $container.on('mousedown', 'img', startMoving);
    //$container.on('mousemove', 'img', startSF);
    addEvent(document,'mousemove',mousemoveHandler);
    addEvent(document,'mouseup',mouseupHandler);
    //$container.on('mouseup', 'img', mouseup);
    $('.js-crop').on('click', crop);
  };

  startResize = function(e) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', resizing);
    $(document).on('mouseup touchend', endResize);
  };
  endResize = function(e) {
    e.preventDefault();
    $(document).off('mouseup touchend', endResize);
    $(document).off('mousemove touchmove', resizing);
  };
  saveEventState = function(e) {
    // Save the initial event details and container state
    event_state.container_width = $container.width();
    event_state.container_height = $container.height();
    event_state.container_left = $container.offset().left;
    event_state.container_top = $container.offset().top;
    event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
    event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

    // This is a fix for mobile safari
    // For some reason it does not allow a direct copy of the touches property
    if (typeof e.originalEvent.touches !== 'undefined') {
      event_state.touches = [];
      $.each(e.originalEvent.touches, function(i, ob) {
        event_state.touches[i] = {};
        event_state.touches[i].clientX = 0 + ob.clientX;
        event_state.touches[i].clientY = 0 + ob.clientY;
      });
    }
    event_state.evnt = e;
  };
  resizing = function(e) {
    var mouse = {},
    width, height, left, top, offset = $container.offset();
    mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
    mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
    // Position image differently depending on the corner dragged and constraints
    if ($(event_state.evnt.target).hasClass('resize-handle-se')) {
      width = mouse.x - event_state.container_left;
      height = mouse.y - event_state.container_top;
      left = event_state.container_left;
      top = event_state.container_top;
    } else if ($(event_state.evnt.target).hasClass('resize-handle-sw')) {
      width = event_state.container_width - (mouse.x - event_state.container_left);
      height = mouse.y - event_state.container_top;
      left = mouse.x;
      top = event_state.container_top;
    } else if ($(event_state.evnt.target).hasClass('resize-handle-nw')) {
      width = event_state.container_width - (mouse.x - event_state.container_left);
      height = event_state.container_height - (mouse.y - event_state.container_top);
      left = mouse.x;
      top = mouse.y;
      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
      }
    } else if ($(event_state.evnt.target).hasClass('resize-handle-ne')) {
      width = mouse.x - event_state.container_left;
      height = event_state.container_height - (mouse.y - event_state.container_top);
      left = event_state.container_left;
      top = mouse.y;
      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
      }
    }
    // Optionally maintain aspect ratio
    if (constrain || e.shiftKey) {
      height = width / orig_src.width * orig_src.height;
    }
    if (width > min_width && height > min_height && width < max_width && height < max_height) {
      // To improve performance you might limit how often resizeImage() is called
      resizeImage(width, height);
      // Without this Firefox will not re-calculate the the image dimensions until drag end
      $container.offset({
        'left': left,
        'top': top
      });
    }
  }

  resizeImage = function(width, height) {
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);
    $(image_target).attr('src', resize_canvas.toDataURL("image/png"));
  };
  //选中图片开始移动时
  startMoving = function(e) {
  	//console.log('鼠标的手势-->',e,'--mouseFlag==',mouseFlag);
  	if(mouseFlag  == 'move'){
  		e.preventDefault();
	    e.stopPropagation();
	    saveEventState(e);
	    $(document).on('mousemove touchmove', moving);
	    $(document).on('mouseup touchend', endMoving);
  	}else if( mouseFlag  == 'se-resize'){
  		//  mouseFlag  == 'nw-resize' || mouseFlag  == 'ne-resize' || mouseFlag  == 'sw-resize' ||
  		var ele =  document.getElementById('resize-image');
  		addEvent(ele,'mousedown',mousedownHandler);
  	}
  	
  };

  //停止移动时,
  endMoving = function(e) {
  	isChanging = false;
    e.preventDefault();
    $(document).off('mouseup touchend', endMoving);
    $(document).off('mousemove touchmove', moving);
    // console.log($('.design_img').css('background-image'));
    matting_rect_list = [];   
    var new_matting_rect_top = $('.design_img').offset().top-$('.resize-image').offset().top;
    var new_matting_rect_left = $('.design_img').offset().left-$('.resize-image').offset().left;
    var new_matting_rect_bottom = new_matting_rect_top + design_mes_all[design_sign_index].matting_rect_list[0].bottom - design_mes_all[design_sign_index].matting_rect_list[0].top;
    var new_matting_rect_right = new_matting_rect_left + design_mes_all[design_sign_index].matting_rect_list[0].right - design_mes_all[design_sign_index].matting_rect_list[0].left;
    matting_rect_list.push({'top': new_matting_rect_top,'left': new_matting_rect_left,'bottom': new_matting_rect_bottom,'right': new_matting_rect_right});
    UploadImgMes();
  };

  moving = function(e) {
    // if($('.resize-image').offset().left - $('.design_img').offset().left >= 0 || $('.design_img').offset().left - $('.resize-image').offset().left >= $('.resize-image').width() - $('.design_img').width()) {

    // }
    resize_k = [];
    resize_k.push(design_mes_all[design_sign_index].resize_k_list[0]);
    design_sign_num = 0;
    $('.design_img').css({'background-image':'url('+ $('.resize-image').attr('src') +')','background-size' : $('.resize-image').width(),'background-position-x': $('.resize-image').offset().left-$('.design_img').offset().left,'background-position-y': $('.resize-image').offset().top-$('.design_img').offset().top});
    // $(".move-line").css({"left": $('.move-line').offset().left-$('.design_img').offset().left,"top": $('.move-line').offset().top-$('.design_img').offset().top});  
    $(".move-line").hide();
    var mouse = {},
        touches;
    e.preventDefault();
    e.stopPropagation();
    touches = e.originalEvent.touches;
    mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft();
    mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
    var move_y_length = mouse.y - (event_state.mouse_y - event_state.container_top);
    var move_x_length = mouse.x - (event_state.mouse_x - event_state.container_left);
    var move_top = $('.resize-image').height()-($('.design_img').offset().top-$('.resize-image').offset().top)-$('.design_img').height()-2;
    var move_left = $('.resize-image').width()-($('.design_img').offset().left-$('.resize-image').offset().left)-$('.design_img').width()-2;
    if(move_y_length >= $('.design_img').offset().top) {
      move_y_length = $('.design_img').offset().top;
    }
    if(move_y_length <= $('.resize-image').offset().top - move_top) {
      move_y_length = $('.resize-image').offset().top - move_top;
    }
    if(move_x_length >= $('.design_img').offset().left) {
      move_x_length = $('.design_img').offset().left;
    }
    if(move_x_length <= $('.resize-image').offset().left - move_left) {
      move_x_length = $('.resize-image').offset().left - move_left;
    }
    // console.log(move_top);
    //console.log('move_x_length = ',move_x_length);
    $container.offset({
      'left': move_x_length,
      'top': move_y_length
    });
    // Watch for pinch zoom gesture while moving
    if (event_state.touches && event_state.touches.length > 1 && touches.length > 1) {
      var width = event_state.container_width,
          height = event_state.container_height;
      var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
      a = a * a;
      var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
      b = b * b;
      var dist1 = Math.sqrt(a);

      a = e.originalEvent.touches[0].clientX - touches[1].clientX;
      a = a * a;
      b = e.originalEvent.touches[0].clientY - touches[1].clientY;
      b = b * b;
      var dist2 = Math.sqrt(a);

      var ratio = dist2 / dist1;
      console.log(mouse.x);

      width = width * ratio;
      height = height * ratio;
      // To improve performance you might limit how often resizeImage() is called
      resizeImage(width, height);
    }
  };

  crop = function() {
      //Find the part of the image that is inside the crop box
    var crop_canvas,
    left = $('.design_img').offset().left - $container.offset().left,
    top = $('.design_img').offset().top - $container.offset().top,
    width = $('.design_img').width(),
    height = $('.design_img').height();

    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;

    crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
    crop_canvas.getContext('2d').fillStyle='white';
    crop_canvas.getContext('2d').globalAlpha = 0.2;
    // crop_canvas.getContext('2d').fillRect(100, 100, 300, 300);
    img_base64_url = crop_canvas.toDataURL("image/png");
    UploadImgMes();
  }
  // $('.design_img').css('background-position-x',$('.resize-image').offset().left-$('.design_img').offset().left);
  init();
};

//Kick everything off with the target image
resizeableImage($('.resize-image'));

var sizes = [];
$(document).on('click',".setjob-content .sel-size ul li:not(.seemore)",function(){
	
	
	if(!$(this).hasClass("active")){
		$(this).addClass('active');
	}else{
		$(this).removeClass('active')
	}
	// ? $(this).removeClass('active') : ;
	design_sign_num = 1;
  sizes = [];
  resize_k = [];
  let tempSize;
  sizes.push($(this).attr('size'));
  for(var i = 0; i < sizes.length; i++) {
  	//console.log('sizes数组：'+sizes);
  	tempSize = sizes[i].split(',');
    sizes[i] = sizes[i].split(',');
    
  }
  
  //sizeArr.push();
  
  
  // resize_k.length = 0;
  if($(this).hasClass('active')){
  	sizeArr.push(tempSize);
  	console.log('sizeArr-->',sizeArr);
  	$('.design_container img').hide();
	  $('.overlay').removeClass('design_img');
	  $('.design_content').append('<div class="design_overlay"><div class="overlay design_img"></div></div>');
	  
	  //点击尺寸的话，matting_rect_list  slogan_rect_list  resize_k  全部为空
	  editORadd = 'add';
	  matting_rect_list = [];
	  slogan_rect_list = [];
	  resize_k = [];
	  UploadImgMes();
  }else{
  	sizeArr.remove(tempSize);   //历史尺寸
  	var idname = sizes[0][0]+'_'+sizes[0][1];
  	console.log('sizeArr---->之后',sizeArr);
  	$(".design_content #"+idname).remove();
  	//消失
  	$("#resize-image").hide();
  	$(".move-line").hide();
  }
});


// 点击裁剪框时触发事件，已选尺寸列表
var width;
var height;
$(document).on('click','.design_overlay',function() {
  $('.resize-image').css({'width':base_img_width,'height':base_img_height});
  
  
  let id = $(this).find('div').attr('id');
  let idArr = id.split('_');
  sizes = idArr;
  resize_k_list  =[];
  //console.log('当前编辑的尺寸= ',idArr);
  
  design_sign_index = $(this).index();
  $('.overlay').removeClass('design_img');
  $(this).find('.overlay').addClass('design_img');
  $('.design_container').css({'top': 0,'left': 0});
  $('.resize-container img').show();

  $(".move-line").css({'width': design_mes_all[$(this).index()].slogan_rect_list[0].right - design_mes_all[$(this).index()].slogan_rect_list[0].left,'height': design_mes_all[$(this).index()].slogan_rect_list[0].bottom - design_mes_all[$(this).index()].slogan_rect_list[0].top,"left": design_mes_all[$(this).index()].slogan_rect_list[0].left + $('.design_img').offset().left,"top": design_mes_all[$(this).index()].slogan_rect_list[0].top + $('.design_img').offset().top});  
  $(".move-line").show();
  // console.log($(this).index());
  console.log(design_mes_all[$(this).index()].matting_rect_list[0].top);
  $('.resize-image').css({'width':$('.resize-image').width()/design_mes_all[$(this).index()].resize_k_list[0],'height':$('.resize-image').height()/design_mes_all[$(this).index()].resize_k_list[0]});
  
  
  //点击裁剪框定位位置
  //补充的宽高
  let replenish_top = ($(this).height())-(design_mes_all[$(this).index()].matting_rect_list[0].bottom - design_mes_all[$(this).index()].matting_rect_list[0].top);
  let replenish_left =($(this).width())-(design_mes_all[$(this).index()].matting_rect_list[0].right - design_mes_all[$(this).index()].matting_rect_list[0].left);
  
  let container_left = $('.design_img').offset().left - design_mes_all[$(this).index()].matting_rect_list[0].left;
  let container_top =   $('.design_img').offset().top - design_mes_all[$(this).index()].matting_rect_list[0].top ;
  
  console.log('replenish_top = ',replenish_top,',replenish_left='+replenish_left,'left='+container_left);
  
  $('.resize-container').css({'position': 'absolute','left':container_left,'top':container_top+replenish_top});


});

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




//编辑标题和副标题
$(".submittitle1, .submittitle2").click(function(){
  var titles = [];
   var file = $('.resize-image')[0].src;
  let nowID;
  $('.setjob-content .title').each(function() {
    titles.push($(this).val());
  });
	
 
  matting_rect_list = [];
  slogan_rect_list = [];
 

	$.ajax({
	    url: 'https://sou.api.autohome.com.cn/ai/v1/aidesign',
	    type: "post",
	    dataType: 'json',
	    data: JSON.stringify({
	      'img' : file,     //输出原图
	      'banner_para' : {
		    'titles_list' : titles,   //文案列表
		    'size_list' : sizeArr,
		    'matting_rect_list' : matting_rect_list,  //裁切矩形
		    'slogan_rect_list' : slogan_rect_list,    //slogan 矩形
		    'font_type_list' : [],                    //字体类型
		    'font_size_list' : [],                    //字体大小
		    'title_color_list' : [],                  //字体颜色
		    'adder_sreen_list' : [],                  //加底幕
		    'resize_k_list' : resize_k,               //缩放倍数
		    'txt_sp_list' : [] ,                      //文案起始位置
		    'logo_rect_list' : [],          
		    'logo_type_list' : []
	      }
	    }),
	    success: function(res) {
        console.log('--->',res)
  			res.base64_image_list.forEach(function(item, index) {
  				//console.log('--->'+item);
  				//console.log('-----------------------');
  				$('.design_content .design_overlay').eq(index).find('.overlay').css('background-image','');
  				var img_base = item.replace('/\+/g','2B%');
  				//console.log('--->'+index);
  				//console.log('--->'+img_base);
  				//console.log('-----------------------');
  				//console.log($('.design_content .design_overlay').eq(index).find('.overlay'));
  				$('.design_content .design_overlay').eq(index).find('.overlay').css('background-image','url(data:image/jpeg;base64,'+ img_base + ')');
  			});
	    },
	    error: function(res) {
	      console.log('错误信息',res);
	    }
	  });

});

$(".submittitle2").click(function(){
	
});










//上传初始图片尺寸和标题
function UploadImgMes() {
  //console.log('sizes',sizes);
  //console.log('matting_rect_list',matting_rect_list);
  //console.log('slogan_rect_list',slogan_rect_list);
 // console.log('resize_k',resize_k);
  //console.log('------------------------------');
  var file = $('.resize-image')[0].src;
  // console.log(file);
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
	    'matting_rect_list' : matting_rect_list,  //裁切矩形
	    'slogan_rect_list' : slogan_rect_list,    //slogan 矩形
	    'font_type_list' : [],                    //字体类型
	    'font_size_list' : [],                    //字体大小
	    'title_color_list' : [],                  //字体颜色
	    'adder_sreen_list' : [],                  //加底幕
	    'resize_k_list' : resize_k,               //缩放倍数
	    'txt_sp_list' : [] ,                      //文案起始位置
	    'logo_rect_list' : [],          
	    'logo_type_list' : []
      }
    }),
    success: function(res) {
      //console.log('后台返回的结果值',res);
      //console.log('width='+sizes[0][0],'height='+sizes[0][1]);
      
      if(res.logo_rect_list.length > 0){
      	 logoToTop(res.logo_rect_list[0],res.logo_type_list);
      }
       var img_base;
      if(res.base64_image_list) {
        for(var i = 0; i < res.base64_image_list.length; i++) {
          img_base = res.base64_image_list[0].replace('/\+/g','2B%');
        }
      }
      //console.log('data:image/jpeg;base64,'+ img_base);
      //if(editORadd == 'add'){
      	$('.design_img').css({'background-position-x': 0,'background-position-y': 0});
	      // $('.design_overlay').css('padding', '6px');
	     
	      design_sign_num == 0 ? design_mes_all[design_sign_index] = res : design_mes_all.push(res);
	      if(design_sign_num == 0) {
	      	//$('.design_img').attr('t_top',res.matting_rect_list[0].top);
	      	
	      	$('.design_img').attr('id',sizes[0][0]+'_'+sizes[0][1]);
	        $('.design_img').css({'background-image' : 'url(data:image/jpeg;base64,'+ img_base +')','background-size' : 'auto','width' : design_mes_all[design_sign_index].matting_rect_list[0].right - design_mes_all[design_sign_index].matting_rect_list[0].left,'height':design_mes_all[design_sign_index].matting_rect_list[0].bottom - design_mes_all[design_sign_index].matting_rect_list[0].top});
	      } else {
	        if(resize_k.length == 0) {
	        	$('.design_img').attr('id',sizes[0][0]+'_'+sizes[0][1]);
	        // $(".move-line").css({"left": res.slogan_rect_list[0].left + res.matting_rect_list[0].left,"top": res.slogan_rect_list[0].top + res.matting_rect_list[0].top});  
	          $('.design_img').css({'background-image' : 'url(data:image/jpeg;base64,'+ img_base +')','width' : sizes[0][0],'height':sizes[0][1],'top' : res.matting_rect_list[0].top,'left' : res.matting_rect_list[0].left});
	          // $('.resize-image').css({'width':$('.resize-image').width()/res.resize_k_list[0],'height':$('.resize-image').height()/res.resize_k_list[0]});
	        }else {
	        	$('.design_img').attr('id',sizes[0][0]+'_'+sizes[0][1]);
	            $('.design_img').css({'background-image' : 'url(data:image/jpeg;base64,'+ img_base +')','background-size' : 'auto','width' : sizes[0][0],'height':sizes[0][1]});
	        }
	      }
	      
	      
	    //拉伸后的图片更改背景图位置  
	    if(editORadd == 'zoom'){
	    	//var left = parseInt($('.resize-container').css('left'));
	    	//var top = parseInt($('.resize-container').css('top'));
	    	var obj = document.getElementById('200_200');
	    	var GetObjPos = getOffset(obj) ;
			//var imgTop = GetObjPos['top'];
			var imgLeft = GetObjPos['left'];
			
	    	var aa = res.matting_rect_list[0].left;
	    	//var afterTop = parseInt(imgTop-D_value);
	    	var afterLeft = parseInt(imgLeft-aa);
	    	console.log(imgLeft,aa);
	    	//$('.resize-container').css({'left':afterLeft});
	    	//$('.resize-container').css({'position': 'absolute','left': $('.design_img').offset().left- design_mes_all[$(this).index()].matting_rect_list[0].left-D_value,'top': $('.design_img').offset().top - design_mes_all[$(this).index()].matting_rect_list[0].top});  
	    }
	    
	      
      //}else{
      //	console.log('移动');
      //}
      
      $('.overlay').show();
      
      
      // $('.design_img').css({'background-image' : 'url(data:image/jpeg;base64,'+ img_base +')','background-size' : 'auto','width' : design_mes_all[design_sign_index].matting_rect_list[0].right - design_mes_all[design_sign_index].matting_rect_list[0].left,'height':design_mes_all[design_sign_index].matting_rect_list[0].bottom - design_mes_all[design_sign_index].matting_rect_list[0].top});
      // 全局变量赋值
      slogan_rect_top = res.slogan_rect_list[0].top;
      slogan_rect_right = res.slogan_rect_list[0].right;
      slogan_rect_bottom = res.slogan_rect_list[0].bottom;
      slogan_rect_left = res.slogan_rect_list[0].left;
      matting_rect_left = res.matting_rect_list[0].left;
      matting_rect_top = res.matting_rect_list[0].top;
      matting_rect_bottom = res.matting_rect_list[0].bottom;
      matting_rect_right = res.matting_rect_list[0].right;
      // resize_k.length = 0;
      resize_k.push(res.resize_k_list[0]);
      // $('.resize-image')[0].src = 'data:image/jpeg;base64,' + str;
      // console.log('data:image/jpeg;base64'+img_base);
      $('.resize-container img').css('opacity',0.5);
      // $('.design_img').css({'background-image' : 'url(data:image/jpeg;base64,'+ img_base +')','width' : sizes[0][0],'height':sizes[0][1],'top' : res.matting_rect_list[0].top,'left' : res.matting_rect_list[0].left});
      $('.design_img').show();
      //$('.design_overlay').css('width',$('.design_img').width());
      // $(".move-line").css({"left": res.slogan_rect_list[0].left + res.matting_rect_list[0].left,"top": res.slogan_rect_list[0].top + res.matting_rect_list[0].top});  
      // $(".move-line").css({'width': slogan_rect_right - slogan_rect_left,'height': slogan_rect_bottom - slogan_rect_top,"left": res.slogan_rect_list[0].left + $('.design_img').offset().left,"top": res.slogan_rect_list[0].top + $('.design_img').offset().top});  
      // $(".move-line").show();
    },
    error: function(res) {
      console.log('错误信息',res);
    }
  });
}
var x,y;
$(".move-line").mousedown(function(e){ //e鼠标事件  
  e.stopPropagation();
  $(this).css("cursor","move");//改变鼠标指针的形状  
  var offset = $(this).offset();//DIV在页面的位置  
  x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离  
  y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离  
  $(document).bind({
    'mousemove': move,
    'mouseup': stop,
    //'onmousewheel':fnWheel
  });
  return false;
});  


function move(ev) {
  design_sign_num = 0;
  ev.stopPropagation();
  // $(".move-line").stop();//加上这个之后 
  $(".move-line").css("cursor","move");  
  var _x = ev.pageX - x;//获得X轴方向移动的值  
  var _y = ev.pageY - y;//获得Y轴方向移动的值  
  $(".move-line").animate({left:_x+"px",top:_y+"px"},10);  
}
function stop() {
  $(document).unbind({
    'mousemove': move,
    'mouseup': stop
  });
  resize_k = [];
  resize_k.push(design_mes_all[design_sign_index].resize_k_list[0]);
  slogan_rect_list = [];   
  var new_slogan_rect_top = $(".move-line").offset().top - $(".design_img").offset().top;
  var new_slogan_rect_left = $(".move-line").offset().left - $(".design_img").offset().left;
  var new_slogan_rect_bottom = new_slogan_rect_top + (design_mes_all[design_sign_index].slogan_rect_list[0].bottom - design_mes_all[design_sign_index].slogan_rect_list[0].top);
  var new_slogan_rect_right = new_slogan_rect_left + (design_mes_all[design_sign_index].slogan_rect_list[0].right - design_mes_all[design_sign_index].slogan_rect_list[0].left);
  slogan_rect_list.push({'top': new_slogan_rect_top,'left': new_slogan_rect_left,'bottom': new_slogan_rect_bottom,'right': new_slogan_rect_right});
  
  matting_rect_list = [];   
  var new_matting_rect_top = $('.design_img').offset().top-$('.resize-image').offset().top;
  var new_matting_rect_left = $('.design_img').offset().left-$('.resize-image').offset().left;
  var new_matting_rect_bottom = new_matting_rect_top + design_mes_all[design_sign_index].matting_rect_list[0].bottom - design_mes_all[design_sign_index].matting_rect_list[0].top;
  var new_matting_rect_right = new_matting_rect_left + design_mes_all[design_sign_index].matting_rect_list[0].right - design_mes_all[design_sign_index].matting_rect_list[0].left;
  matting_rect_list.push({'top': new_matting_rect_top,'left': new_matting_rect_left,'bottom': new_matting_rect_bottom,'right': new_matting_rect_right});

  UploadImgMes();
}







//预览发布

$('.fabu').click(function() {
  $(".move-line").hide();
  $('#imgModal').modal('show');
  $('#imgModal').on('shown.bs.modal', function () {
	  var s =  $("#slider").children('li').length;
      if(s == 0){
      	$('[name="minNum"]').hide();
      	$('[name="maxNum"]').hide();
      }else if(s >= 1){
      	$('[name="minNum"]').show();
      	$('[name="minNum"]').text('1');
      	$('[name="maxNum"]').show();
      	$('[name="maxNum"]').text(+s);
      	//设置图片名称
      	let photo_name = $("#slider").eq(0).find('img').width()+'×'+$("#slider").eq(0).find('img').height();
      	$(".photoName").text('尺寸:'+photo_name);
      	//console.log('--->'+photo_name);
      }
  });
  Fabu();
});


function Fabu() {
  $('#slider').html('');
  
  $('.design_overlay .overlay').each(function() {
  	let width = $(this).width();
  	let height = $(this).height();
    //console.log('检查追加元素的id值-->',$(this).attr('id'));	
  	
  	if(width >= 500 && width <= 700){
  		$('#slider').append('<li><img title="design-image" src='+ $(this).css('background-image').replace('url("','').replace('")','') +' alt="" class="car-img" width='+width+' height='+height+' style="zoom:0.9;"></li>');
  	    return;
  	}
  	if(width > 700 && width <800){
  		$('#slider').append('<li><img title="design-image" src='+ $(this).css('background-image').replace('url("','').replace('")','') +' alt="" class="car-img" width='+width+' height='+height+' style="zoom:0.6;"></li>');
  	    return;
  	}
  	if(width >=800){
		$('#slider').append('<li><img title="design-image" src='+ $(this).css('background-image').replace('url("','').replace('")','') +' alt="" class="car-img" width='+width+' height='+height+' style="zoom:0.5;"></li>');
	    return;
  	}else{
		$('#slider').append('<li><img title="design-image" src='+ $(this).css('background-image').replace('url("','').replace('")','') +' alt="" class="car-img" width='+width+' height='+height+' ></li>');
	    return;
  	}
    
  });

    
   
}

//点击下载
$("#out-btn").click(function(){
	var arr = [];
    $('.car-img').each(function () {
        //arr.push($(this).attr('src'));
        var obj = {
            src: $(this).attr('src'),
            title: $(this).attr('width')+'×'+$(this).attr('height')
        };
        arr.push(obj)
    });
    arr.map(function (i) {
        outDownLoad.click(oDownLoad(i.src,i.title));
    });
});



//next
$(".next").click(function(){
	var nowNum = parseInt($('[name="minNum"]').text());
	nowNum = nowNum+1;
	var maxNum = parseInt($('[name="maxNum"]').text());
	if(nowNum <= maxNum){
		
		$("#slider li").hide();
		$("#slider li:eq('"+(nowNum-1)+"')").css({'display':'block','position':'relative','float':'left'});
		$('[name="minNum"]').text(nowNum);
		console.log('nowNum--->'+(nowNum-1));
		let photo_name = $("#slider li").eq((nowNum-1)).find('img').width()+'×'+$("#slider li").eq(nowNum-1).find('img').height();
      	$(".photoName").text('尺寸:'+photo_name);
	}
});
//.prev
$(".prev").click(function(){
	var nowNum = parseInt($('[name="minNum"]').text());
	nowNum = nowNum-1;
	var maxNum = parseInt($('[name="maxNum"]').text());
	if(1<= nowNum && nowNum <= maxNum){
		$("#slider li").hide();
		$("#slider li:eq('"+(nowNum-1)+"')").css({'display':'block','position':'relative','float':'left'});
		$('[name="minNum"]').text(parseInt(nowNum));
		let photo_name = $("#slider li").eq(nowNum-1).find('img').width()+'×'+$("#slider li").eq(nowNum-1).find('img').height();
      	$(".photoName").text('尺寸:'+photo_name);
	}
});




var outDownLoad = document.getElementById("out");

function oDownLoad(url,title) {
    console.log('进入oDownLoad方法');
    console.log('浏览器类型:', myBrowser());
    if (myBrowser() === "IE") { //IE  //|| myBrowser() === "Edge"
        outDownLoad.href = "#";
        // SaveAs5(url);
        downloadFile("下载.jpg", url);
    } else {
        //!IE
        var blob = base64Img2Blob(url);
        url = window.URL.createObjectURL(blob);
        console.log(url);
        outDownLoad.href = url;
        outDownLoad.download = title;
    }
}


/**
 * todo 判断浏览器
 * @returns {string}
 */
function myBrowser() {
    console.log('进入判断浏览器方法');
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("OPR") > -1;
    if (isOpera) {
        return "Opera";
    }
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    }
    if (userAgent.indexOf("Trident") > -1) {
        return "IE";
    }
    if (userAgent.indexOf("Edge") > -1) {
        return "Edge";
    }
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    }
}

/**
 * todo 支持IE11
 * @param fileName
 * @param content
 */
function downloadFile(fileName, content) {
    var blob = base64Img2Blob(content);
    //支持IE11
    window.navigator.msSaveBlob(blob, fileName);
}

function base64Img2Blob(code) {
    var parts = code.split(';base64,');
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}


