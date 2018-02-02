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



//点击banner裁剪框显示对应的位置
$(document).on('click','.design_overlay',function() {
  let now_id = $(this).children('.overlay').attr('id');
  let now_index = $('.design_content .design_overlay').index($(this));
  let now_size = now_id.split('_');  //当前尺寸的宽高
  //console.log('now_size --->',now_size);
  //console.log('--->',now_index);
  let GetObjPos = getOffset(this) ;
  let imgTop = GetObjPos['top'];
  let imgLeft = GetObjPos['left'];

  let bgimg_width = base_image_width / history_res_obj[now_index].resize_k_list[0];
  let bgimg_height = base_image_height / history_res_obj[now_index].resize_k_list[0];
  let bgimg_left = bgimg_width - history_res_obj[now_index].matting_rect_list[0]['right'];
  let bgimg_top = bgimg_height - history_res_obj[now_index].matting_rect_list[0]['bottom'];

  let slogan_width = history_res_obj[now_index].slogan_rect_list[0]['right'] - history_res_obj[now_index].slogan_rect_list[0]['left'];
  let slogan_height = history_res_obj[now_index].slogan_rect_list[0]['bottom'] - history_res_obj[now_index].slogan_rect_list[0]['top'];
  let slogan_left = imgLeft + history_res_obj[now_index].slogan_rect_list[0]['left']
  let slogan_top = imgTop + history_res_obj[now_index].slogan_rect_list[0]['top']
  
  let drag_range_width = history_res_obj[now_index].matting_rect_list[0]['left'] + 2*bgimg_width - history_res_obj[now_index].matting_rect_list[0]['right'];
  let drag_range_height = history_res_obj[now_index].matting_rect_list[0]['top'] + 2*bgimg_height - history_res_obj[now_index].matting_rect_list[0]['bottom'];
  let drag_range_left = imgLeft - history_res_obj[now_index].matting_rect_list[0]['left'] - bgimg_width + history_res_obj[now_index].matting_rect_list[0]['right'];
  let drag_range_top = imgTop - history_res_obj[now_index].matting_rect_list[0]['top'] - bgimg_height + history_res_obj[now_index].matting_rect_list[0]['bottom'];

  let banner_height = history_res_obj[now_index].matting_rect_list[0]['bottom'] - history_res_obj[now_index].matting_rect_list[0]['top'];
  let banner_width = history_res_obj[now_index].matting_rect_list[0]['right'] - history_res_obj[now_index].matting_rect_list[0]['left'];
  $(".design_container").css({'position':'absolute','left':0,'top':0 });

  /*
  设置位置共分为3种情况:
    正常尺寸: banner_height=now_size[1] && banner_width=now_size[0]
    上补边:   banner_height<now_size[1] && banner_width=now_size[0]
    右补边:   banner_height=bgimg_height && banner_width<now_size[0]
  */
  if(banner_height == now_size[1] && banner_width == now_size[0]){
    //设置标题裁剪框的位置
    console.log('now_id-->',now_id);
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
      containment: '#'+now_id   //可拖动的区域范围是当前的尺寸裁剪框
    })
    ;
    //设置原图尺寸和位置
    $("#resize-image").css({
      'width':bgimg_width,
      'height':bgimg_height,
      'display':'block',
      'position':'absolute',
      'left':bgimg_left,
      'top':bgimg_top,
      'opacity':0.5
    })
    .draggable({
      cursor: "move",
      containment: "parent",    //可拖动的区域范围设置为父元素
      start:function(event,ui){
        console.log('鼠标开始拖拽',ui.position);
      },
      stop:function(event,ui){
        console.log('鼠标松开',ui.position);
      }
    });


    //设置可拖动范围区域
    $(".content").css({
      'position':'absolute',
      'display':'inline-block',
      'width':drag_range_width,
      'height':drag_range_height,
      'left':drag_range_left,
      'top':drag_range_top,
      'border':'1px solid #000'
    });
  }else if(banner_height < now_size[1] && banner_width == now_size[0]){
    let padding_top = now_size[1] - banner_height;
    console.log('上补边-->',padding_top);
    //设置标题裁剪框的位置
    console.log('now_id-->',now_id);
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
      containment: '#'+now_id   //可拖动的区域范围是当前的尺寸裁剪框
    })
    ;
    //设置原图尺寸和位置
    $("#resize-image").css({
      'width':bgimg_width,
      'height':bgimg_height,
      'display':'block',
      'position':'absolute',
      'left':0,
      'top':0,
      'opacity':0.5
    })
    .draggable({
      cursor: "move",
      containment: "parent",    //可拖动的区域范围设置为父元素
      start:function(event,ui){
        console.log('鼠标开始拖拽',ui.position);
      },
      stop:function(event,ui){
        console.log('鼠标松开',ui.position);
      }
    });


    //设置可拖动范围区域
    $(".content").css({
      'position':'absolute',
      'display':'inline-block',
      'width':drag_range_width,
      'height':bgimg_height,
      'left':drag_range_left,
      'top':drag_range_top+padding_top,
      'border':'1px solid #000'
    });


  }else if(banner_height == now_size[1] && banner_width < now_size[0]){
    let padding_right = now_size[0] - slogan_width;
    console.log('右补边-->',padding_right);
  }



  


});
















