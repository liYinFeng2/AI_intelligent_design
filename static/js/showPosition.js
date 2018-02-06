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


//此文件中的全局变量
let now_id;
let now_size;  //当前尺寸的宽高
let GetObjPos;
let imgTop;
let imgLeft;
let bgimg_width;
let bgimg_height;
let bgimg_left;
let bgimg_top;

let slogan_width;
let slogan_height;
let slogan_left;
let slogan_top;

let drag_range_width;
let drag_range_height;
let drag_range_left;
let drag_range_top;

let banner_height;
let banner_width;

 //背景图
 let start_top;
 let start_left;
 let end_top;
 let end_left;
 //标题框
 let slogan_start_top;
 let slogan_start_left;
 let slogan_end_top;
 let slogan_end_left;

 let padding_top;
 let padding_right;

//点击banner裁剪框显示对应的位置
$(document).on('click','.design_overlay',function() {
  now_id = $(this).children('.overlay').attr('id');
  now_index = $('.design_content .design_overlay').index($(this));
  now_size = now_id.split('_');  //当前尺寸的宽高
  GetObjPos = getOffset(this) ;
  imgTop = GetObjPos['top'];
  imgLeft = GetObjPos['left'];

  bgimg_width = base_image_width / history_res_obj[now_index].resize_k_list[0];
  bgimg_height = base_image_height / history_res_obj[now_index].resize_k_list[0];
  bgimg_left = bgimg_width - history_res_obj[now_index].matting_rect_list[0]['right'];
  bgimg_top = bgimg_height - history_res_obj[now_index].matting_rect_list[0]['bottom'];

  slogan_width = history_res_obj[now_index].slogan_rect_list[0]['right'] - history_res_obj[now_index].slogan_rect_list[0]['left'];
  slogan_height = history_res_obj[now_index].slogan_rect_list[0]['bottom'] - history_res_obj[now_index].slogan_rect_list[0]['top'];
  slogan_left = imgLeft + history_res_obj[now_index].slogan_rect_list[0]['left']
  slogan_top = imgTop + history_res_obj[now_index].slogan_rect_list[0]['top']
  
  drag_range_width = history_res_obj[now_index].matting_rect_list[0]['left'] + 2*bgimg_width - history_res_obj[now_index].matting_rect_list[0]['right'];
  drag_range_height = history_res_obj[now_index].matting_rect_list[0]['top'] + 2*bgimg_height - history_res_obj[now_index].matting_rect_list[0]['bottom'];
  drag_range_left = imgLeft - history_res_obj[now_index].matting_rect_list[0]['left'] - bgimg_width + history_res_obj[now_index].matting_rect_list[0]['right'];
  drag_range_top = imgTop - history_res_obj[now_index].matting_rect_list[0]['top'] - bgimg_height + history_res_obj[now_index].matting_rect_list[0]['bottom'];

  banner_height = history_res_obj[now_index].matting_rect_list[0]['bottom'] - history_res_obj[now_index].matting_rect_list[0]['top'];
  banner_width = history_res_obj[now_index].matting_rect_list[0]['right'] - history_res_obj[now_index].matting_rect_list[0]['left'];
  $(".design_container").css({'position':'absolute','left':0,'top':0 });

  /*
  设置位置共分为3种情况:
    正常尺寸: banner_height=now_size[1] && banner_width=now_size[0]
    上补边:   banner_height<now_size[1] && banner_width=now_size[0]
    右补边:   banner_height=bgimg_height && banner_width<now_size[0]
  */
 

  //正常尺寸的情况
  if(banner_height == now_size[1] && banner_width == now_size[0]){
    //设置标题裁剪框的位置
    set_slogan_position();
    
    //设置原图尺寸和位置
    $("#resize-image")
    .css({
      'width':bgimg_width,
      'height':bgimg_height,
      'display':'block',
      'position':'absolute',
      'left':'-2px',
      'top':'-2px',
      'opacity':0.5,
      'cursor':'move'
    })
    .draggable({
      cursor: "move",
      containment: ".content",    //可拖动的区域范围设置为父元素
      start:function(event,ui){
        $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
        start_top = ui.position.top;
        start_left = ui.position.left;
      },
      stop:function(event,ui){
        end_top = ui.position.top;
        end_left = ui.position.left;
        //计算x、y的相随位移
        move_bg_banner(start_top,start_left,end_top,end_left,now_index,now_size);
      }
    });
    $("#zoom_box")
    .css({
      'width':bgimg_width,
      'height':bgimg_height,
      'display':'block',
      'position':'absolute',
      'left':bgimg_left,
      'top':bgimg_top,
      'cursor':'move'
    })
    .resizable({
      alsoResize: "#resize-image",
      aspectRatio:bgimg_width / bgimg_height,
      start:function(event,ui){
        //$('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
        //console.log('start',ui.originalSize);
      },
      stop:function(event,ui){
        let k = base_image_width / ui.size.width;
        //console.log('缩放后的宽-->',ui.size);
        //console.log('缩放后的k-->'+k);
        zoom_img(k);
      }
    });


    //设置可拖动范围区域  1
    drag_range(1);
    
  }
  //上补边的情况
  if(banner_height < now_size[1] && banner_width == now_size[0]){                 
    padding_top = now_size[1] - banner_height;
    //设置标题裁剪框的位置
    set_slogan_position();

    //设置原图尺寸和位置
    $("#resize-image").css({
      'width':bgimg_width,
      'height':bgimg_height,
      'display':'block',
      'position':'absolute',
      'left':0,
      'top':0,
      'opacity':0.5,
      'cursor':'move'
    })
    .draggable({
      cursor: "move",
      containment: ".content",    //可拖动的区域范围设置为父元素
      start:function(event,ui){
        $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
        start_top = ui.position.top;
        start_left = ui.position.left;
      },
      stop:function(event,ui){
        end_top = ui.position.top;
        end_left = ui.position.left;
        //计算x、y的相随位移
        move_bg_banner(start_top,start_left,end_top,end_left,now_index,now_size);
      }
    });
    $("#zoom_box")
    .css({
      'width':bgimg_width,
      'height':bgimg_height,
      'display':'block',
      'position':'absolute',
      'left':bgimg_left,
      'top':0,
      'cursor':'move'
    })
    .resizable({
      alsoResize: "#resize-image",
      aspectRatio:bgimg_width / bgimg_height,
      start:function(event,ui){
        //$('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
        //console.log('start',ui.originalSize);
      },
      stop:function(event,ui){
        let k = base_image_width / ui.size.width;
        zoom_img(k);
      }
    });

    //设置可拖动范围区域  2
    drag_range(2);
    


  }
  //右补边的情况
  if(banner_height == now_size[1] && banner_width < now_size[0]){                
    padding_right = now_size[0] - slogan_width;
    //设置标题裁剪框的位置
    set_slogan_position();

    //设置原图尺寸和位置
    $("#resize-image").css({
      'width':bgimg_width,
      'height':bgimg_height,
      'display':'block',
      'position':'absolute',
      'left':0,
      'top':0,
      'opacity':0.5,
      'cursor':'move'
    })
    .draggable({
      cursor: "move",
      containment: ".content",    //可拖动的区域范围设置为父元素
      start:function(event,ui){
        $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
        start_top = ui.position.top;
        start_left = ui.position.left;
      },
      stop:function(event,ui){
        end_top = ui.position.top;
        end_left = ui.position.left;
        //计算x、y的相随位移
        move_bg_banner(start_top,start_left,end_top,end_left,now_index,now_size);
      }
    });
    $("#zoom_box")
    .css({
      'width':bgimg_width,
      'height':bgimg_height,
      'display':'block',
      'position':'absolute',
      'left':0,
      'top':bgimg_top,
      'cursor':'move'
    })
    .resizable({
      alsoResize: "#resize-image",
      aspectRatio:bgimg_width / bgimg_height,
      start:function(event,ui){
        //$('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
        //console.log('start',ui.originalSize);
      },
      stop:function(event,ui){
        let k = base_image_width / ui.size.width;
        //console.log('缩放后的宽-->',ui.size);
        //console.log('缩放后的k-->'+k);
        zoom_img(k);
      }
    });

    //设置可拖动范围区域  3
    drag_range(3);
   
  }
});


/* -----   公共方法   ------*/ 


//设置标题裁剪框的位置
function set_slogan_position(){
  $(".move-line")
    .css({
      'width':slogan_width,
      'height':slogan_height,
      'left':slogan_left,
      'top':slogan_top,
      'display':'block',
    })
    .draggable({
      cursor: "move",
      containment: '#'+now_id,   //可拖动的区域范围是当前的尺寸裁剪框
      start:function(event,ui){
        slogan_start_top = ui.offset.top;
        slogan_start_left = ui.offset.left;
      },
      stop:function(event,ui){
        slogan_end_top = ui.offset.top;
        slogan_end_left = ui.offset.left;
        //计算x、y的相随位移
        move_slogan_banner(slogan_start_top,slogan_start_left,slogan_end_top,slogan_end_left,now_index,now_size);
      }
    });
}
//可拖动范围
function drag_range(flag){
  // 1:正常  2:上补边  3:右补边
  if(flag == 1){
    $(".content").css({
      'width':drag_range_width,
      'height':drag_range_height,
      'left':drag_range_left,
      'top':drag_range_top,
      'display':'block'
    });

  }else if(flag == 2){
    $(".content").css({
      'width':drag_range_width,
      'height':bgimg_height,
      'left':drag_range_left,
      'top':imgTop-history_res_obj[now_index].matting_rect_list[0]['top']+padding_top,
      'display':'block'
    });
  }else if(flag == 3){
    $(".content").css({
      'width':bgimg_width,
      'height':drag_range_height,
      'left':imgLeft-history_res_obj[now_index].matting_rect_list[0]['left'],
      'top':drag_range_top,
      'display':'block'
    });
  }
}











