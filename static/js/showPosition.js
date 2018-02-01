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
  
  let now_index = $('.design_content .design_overlay').index($(this));
  //console.log('--->',now_index);
  let GetObjPos = getOffset(this) ;
  let imgTop = GetObjPos['top'];
  let imgLeft = GetObjPos['left'];

  let bgimg_width = base_image_width / history_res_obj[now_index].resize_k_list[0];
  let bgimg_height = base_image_height / history_res_obj[now_index].resize_k_list[0];
  let bgimg_left = imgLeft - history_res_obj[now_index].matting_rect_list[0]['left'];
  let bgimg_top = imgTop - history_res_obj[now_index].matting_rect_list[0]['top'];

  let slogan_width = history_res_obj[now_index].slogan_rect_list[0]['right'] - history_res_obj[now_index].slogan_rect_list[0]['left'];
  let slogan_height = history_res_obj[now_index].slogan_rect_list[0]['bottom'] - history_res_obj[now_index].slogan_rect_list[0]['top'];
  let slogan_left = imgLeft + history_res_obj[now_index].slogan_rect_list[0]['left']
  let slogan_top = imgTop + history_res_obj[now_index].slogan_rect_list[0]['top']

  $(".design_container").css({'position':'absolute','left':0,'top':0 });
  //设置原图尺寸
  $("#resize-image").css({
    'width':bgimg_width,
    'height':bgimg_height,
    'display':'block'
  });
  //设置原图的容器位置
  $(".design_container .content").css({
    'position':'absolute',
    'left':bgimg_left,
    'top':bgimg_top,
    'opacity':0.5
  });
  $(".move-line").css({
    'width':slogan_width,
    'height':slogan_height,
    'left':slogan_left,
    'top':slogan_top,
    'display':'block',
  });
  
});

//鼠标显示
















