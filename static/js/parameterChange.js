//公共方法,请求后台的接口
function public_request_interface(flag_type){
    $.ajax({
        url: 'https://sou.api.autohome.com.cn/ai/v1/aidesign',
        type: "post",
        dataType: 'json',
        data: JSON.stringify({
          'img' : file_url,                           //输出原图
          'banner_para' : {
            'titles_list' : titles_list,                   //文案列表
            'size_list' : size_list,
            'matting_rect_list' : matting_rect_list,  //裁切矩形
            'slogan_rect_list' : slogan_rect_list,    //slogan 矩形
            'font_type_list' : [],                    //字体类型
            'font_size_list' : [],                    //字体大小
            'title_color_list' : [],                  //字体颜色
            'adder_sreen_list' : [],                  //加底幕
            'resize_k_list' : resize_k_list,          //缩放倍数
            'txt_sp_list' : [] ,                      //文案起始位置
            'logo_rect_list' : [],                    //logo位置
            'logo_type_list' : logo_type_list         //logo的type类型
          }
        }),
        success: function(res) {
           //标题
           if(flag_type == 1){
            edit_title_returnRes(res);
           }
           //更换背景图
           if(flag_type == 2){
            change_background_image_returnRes(res);
           }
           //尺寸
           if(flag_type == 3){
            choise_or_delete_size_returnRes(res);
           }
           //选择logo
           if(flag_type == 4){
            choise_logo_returnRes(res);
           }
           //拖动背景图
           if(flag_type == 6){
            move_bg_banner_returnRes(res);
           }
           //缩放背景图
           if(flag_type == 7){
            zoom_img_returnRes(res); 
           }
           //拖动slogan裁剪框
           if(flag_type == 8){
            move_slogan_banner_returnRes(res);
           }

           
           //隐藏页面的裁剪框、背景图、可移动范围区域
           $(".resize-image").hide();
           $(".move-line").hide();
           $("#content").hide();
           $("#zoom_box").hide();
        },
        error: function(res) {
          console.log('错误信息',res);
        }
    });
}










//编辑主标题和副标题(设置全局变量)   --------  处理返回结果 1
$(".submittitle1, .submittitle2").click(function(){
    edit_title();
});
function edit_title(){
    file_url = $('#resize-image').attr('src');
    titles_list = [];
    $('.setjob-content .title').each(function() {
        titles_list.push($(this).val());
    });
    size_list = history_size_arr;
    matting_rect_list = [];
	slogan_rect_list = [];
    resize_k_list = [];

    logo_type_list = [];
    for(let i =0;i<history_size_arr.length;i++){
        if(logo_type_choise_list.length > 0){
            logo_type_list[i] = logo_type_choise_list;
        }
    }
    //ajax请求
    public_request_interface(1);
}
function edit_title_returnRes(res){
    //console.log('编辑标题-->',res);
    $(".resize-image").hide();
    res.base64_image_list.forEach(function(item, index) {
        $('.design_content .design_overlay').eq(index).find('.overlay').css('background-image','url()');
        var img_base = item.replace('/\+/g','2B%');
        $('.design_content .design_overlay').eq(index).find('.overlay').css('background-image','url(data:image/jpeg;base64,'+ img_base + ')');
    });
}


//更换背景图片(设置全局变量)  -------  处理返回结果 2
function change_background_image(){
    file_url = arguments[0];
    titles_list = [];
    $('.setjob-content .title').each(function() {
        titles_list.push($(this).val());
    });
    size_list = history_size_arr;
    matting_rect_list = [];
	slogan_rect_list = [];
    resize_k_list = [];
    logo_type_list = [];
    //ajax请求
    public_request_interface(2);
}

function change_background_image_returnRes(res){
    //设置已选尺寸的图
    res.base64_image_list.forEach(function(item, index) {
        $('.design_content .design_overlay').eq(index).find('.overlay').css('background-image','');
        var img_base = item.replace('/\+/g','2B%');
        $('.design_content .design_overlay').eq(index).find('.overlay').css('background-image','url(data:image/jpeg;base64,'+ img_base + ')');
    });

    //设置全局变量   -- 历史值
    let res_length = history_res_obj.length;
    history_res_obj.forEach(function(item,index){
        history_res_obj[index].adder_sreen_list[0] = res.adder_sreen_list[index];
        history_res_obj[index].base64_image_list[0] = res.base64_image_list[index];
        history_res_obj[index].font_size_list[0] = res.font_size_list[index];
        history_res_obj[index].logo_rect_list[0] = res.logo_rect_list[index];
        history_res_obj[index].logo_type_list[0] = res.logo_type_list[index];
        history_res_obj[index].matting_rect_list[0] = res.matting_rect_list[index];
        history_res_obj[index].resize_k_list[0] = res.resize_k_list[index];
        history_res_obj[index].slogan_rect_list[0] = res.slogan_rect_list[index];
        history_res_obj[index].title_color_list[0] = res.title_color_list[index];
        history_res_obj[index].txt_sp_list[0] = res.txt_sp_list[index];
    });
    //console.log('历史值 history_res_obj---',history_res_obj);

    //设置logo列表的显示顺序
    logo_one_result = [];
    if(res.logo_type_list.length > 0){
        logo_to_top(res.logo_rect_list[0],res.logo_type_list);
    }

}

//选择(删除)常用尺寸、自定义尺寸(设置全局变量)  -------  处理返回结果 3
function choise_or_delete_size(){
    file_url = $('#resize-image').attr('src');
    titles_list = [];
    $('.setjob-content .title').each(function() {
        titles_list.push($(this).val());
    });
    size_list = [];
    size_list[0] = arguments[0];
    matting_rect_list = [];
	slogan_rect_list = [];
    resize_k_list = [];

    logo_type_list = [];
    if(logo_type_choise_list.length > 0){
        logo_type_list[0] = logo_type_choise_list;
    }
    //ajax请求
    public_request_interface(3);
}

function choise_or_delete_size_returnRes(res){
    //console.log('返回结果信息-->',result);
    let img_base =  res.base64_image_list[0].replace('/\+/g','2B%');
    $("#"+now_index_id).css({
        'background-image' : 'url(data:image/jpeg;base64,'+ img_base +')',
        'background-size' : 'auto',
        'width' : size_list[0][0],
        'height':size_list[0][1],
        'display':'block'
    });
    //设置logo列表的显示顺序
    if(res.logo_type_list.length > 0){
        logo_to_top(res.logo_rect_list[0],res.logo_type_list);
    }

    //设置全局变量   -- 历史值
    history_res_obj.push(res);
}

//选择logo(设置全局变量)  -------  处理返回结果 4
function choise_logo(){
    logo_type_choise_list = [];
    logo_type_choise_list.push(arguments[0]);

    file_url = $('#resize-image').attr('src');
    titles_list = [];
    $('.setjob-content .title').each(function() {
        titles_list.push($(this).val());
    });
    size_list = [];
    size_list =  history_size_arr;

    matting_rect_list = [];
    slogan_rect_list = [];
    resize_k_list = [];
    logo_type_list = [];
    for(let i =0;i<history_size_arr.length;i++){
    	logo_type_list[i] = logo_type_choise_list;
    }

    //ajax请求
    public_request_interface(4);

}

function choise_logo_returnRes(res){
    //console.log('4---->',res);
    res.base64_image_list.forEach(function(item, index) {
        $('.design_content .design_overlay').eq(index).find('.overlay').css('background-image','url()');
        var img_base = item.replace('/\+/g','2B%');
        $('.design_content .design_overlay').eq(index).find('.overlay').css('background-image','url(data:image/jpeg;base64,'+ img_base + ')');
    });
}
//选择logo图标
$(document).on('click','.logoList li img',function(){
    let logoWidth;
    let logoHeight;
    //页面点击效果
	$(this).parent().siblings().removeClass('pitchon');
	$(this).parent().addClass('pitchon');
	$('.logo_content').css({'width':logoWidth,'height':logoHeight});
    $('.logo_content img').attr('src',$(this).attr('src'));
    let name = $(this).attr('name');

    choise_logo(name);
});



//遍历logo,将符合条件的显示到前面
function logo_to_top(res_list,type_list){
   if(logo_one_result.toString() == type_list.toString() ){
        return false;
   }else{
    let editHtml = '';
    $(".logoList li").siblings().removeClass('active pitchon');
    $(".logoList li img").each(function(index,item){
        if(contains(type_list,item.name)){
            let now_html = '<li class="active">'+$(this).parent().html()+'</li>';
            editHtml = editHtml + now_html;
            $(this).parent().remove();
        }
    });
    
    var html = $(".logoList ul").html();
    $(".logoList ul").html(editHtml+html);
    //赋值全局变量,防止重复操作
    logo_one_result = type_list;
   }
}
function contains(arr, obj) {  
    var i = arr.length; 
    var flag = 0;
    for(var j=0;j<i;j++){
    	if(arr[j] === obj){
	    	flag++;
	    }
    }
    if(flag >0){
    	return true;
    }
}  

//删除品牌logo(设置全局变量)   -------  处理返回结果 5
function delete_logo(){

}

function delete_logo_returnRes(){

}

//拖动背景图(设置全局变量)   -------  处理返回结果 6 
function move_bg_banner(){
    // start_top,start_left,end_top,end_left,now_index,now_size
    let d_value_y = arguments[2] - arguments[0];
    let d_value_x = arguments[3] - arguments[1];

    let index_num = arguments[4];
    file_url = $('#resize-image').attr('src');
    titles_list = [];
    $('.setjob-content .title').each(function() {
        titles_list.push($(this).val());
    });

    size_list = [];
    size_list.push(arguments[5]);
    matting_rect_list = [];
    matting_rect_list = [{'top':0,'bottom':0,'left':0,'right':0}];
    
    matting_rect_list[0]['top'] = history_res_obj[index_num].matting_rect_list[0]['top'] - d_value_y;
    matting_rect_list[0]['bottom'] = history_res_obj[index_num].matting_rect_list[0]['bottom'] - d_value_y;
    matting_rect_list[0]['left'] = history_res_obj[index_num].matting_rect_list[0]['left'] - d_value_x;
    matting_rect_list[0]['right'] = history_res_obj[index_num].matting_rect_list[0]['right'] - d_value_x;

    slogan_rect_list = [];
    
    resize_k_list = [];
    resize_k_list.push(history_res_obj[index_num].resize_k_list[0]);

    logo_type_list = [];
    if(logo_type_choise_list.length > 0){
        logo_type_list[0] = logo_type_choise_list;
    }

    //ajax请求
    public_request_interface(6);
}
function move_bg_banner_returnRes(res){
    //console.log('更改的索引位置-->'+now_index);
    $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
    let img_base = res.base64_image_list[0].replace('/\+/g','2B%');
    $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url(data:image/jpeg;base64,'+ img_base + ')');

    //更改历史记录
    reset_data(res);
}
//缩放背景图(设置全局变量)  -------  处理返回结果 7
function zoom_img(){
    file_url = $('#resize-image').attr('src');
    titles_list = [];
    $('.setjob-content .title').each(function() {
        titles_list.push($(this).val());
    });
    size_list = history_size_arr;
    matting_rect_list = [];
	slogan_rect_list = [];
    resize_k_list = [];
    resize_k_list.push(arguments[0]);

    logo_type_list = [];
    if(logo_type_choise_list.length > 0){
        logo_type_list[0] = logo_type_choise_list;
    }
    //ajax请求
    public_request_interface(7);

}
function zoom_img_returnRes(res){
    //console.log('--->',res);
    console.log('更改的索引位置-->'+now_index);
    $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
    let img_base = res.base64_image_list[0].replace('/\+/g','2B%');
    $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url(data:image/jpeg;base64,'+ img_base + ')');
    let ss = 'data:image/jpeg;base64,'+ img_base;
    //console.log('------>',ss);

    //更改历史记录
    reset_data(res);
}

//拖动title裁剪框(设置全局变量)  -------  处理返回结果 8
function move_slogan_banner(){
    // slogan_start_top,slogan_start_left,slogan_end_top,slogan_end_left,now_index,now_size
    let d_value_y = arguments[2] - arguments[0];
    let d_value_x = arguments[3] - arguments[1];

    let index_num = arguments[4];
    file_url = $('#resize-image').attr('src');
    titles_list = [];
    $('.setjob-content .title').each(function() {
        titles_list.push($(this).val());
    });

    size_list = [];
    size_list.push(arguments[5]);
    matting_rect_list = [];

    slogan_rect_list = [];
    slogan_rect_list = [{'top':0,'bottom':0,'left':0,'right':0}];
    console.log('当前编辑的对象slogan_rect_list数组-->',history_res_obj[index_num].slogan_rect_list[0]);
    
    slogan_rect_list[0]['top'] = history_res_obj[index_num].slogan_rect_list[0]['top'] + d_value_y;
    slogan_rect_list[0]['bottom'] = history_res_obj[index_num].slogan_rect_list[0]['bottom'] + d_value_y;
    slogan_rect_list[0]['left'] = history_res_obj[index_num].slogan_rect_list[0]['left'] + d_value_x;
    slogan_rect_list[0]['right'] = history_res_obj[index_num].slogan_rect_list[0]['right'] + d_value_x;
    console.log('新的数组-->',slogan_rect_list[0]);
    resize_k_list = [];
    resize_k_list.push(history_res_obj[index_num].resize_k_list[0]);

    logo_type_list = [];
    if(logo_type_choise_list.length > 0){
        logo_type_list[0] = logo_type_choise_list;
    }

    console.log('当前编辑的位置--->'+index_num);
    //ajax请求
    public_request_interface(8);
}
function move_slogan_banner_returnRes(res){
    //console.log('更改的索引位置-->'+now_index);
    $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url()');
    let img_base = res.base64_image_list[0].replace('/\+/g','2B%');
    $('.design_content .design_overlay').eq(now_index).find('.overlay').css('background-image','url(data:image/jpeg;base64,'+ img_base + ')');

    //更改历史记录
    reset_data(res);
}


function reset_data(res){
     //更改历史记录
     history_res_obj[now_index].adder_sreen_list[0] = res.adder_sreen_list[0];
     history_res_obj[now_index].base64_image_list[0] = res.base64_image_list[0];
     history_res_obj[now_index].font_size_list[0] = res.font_size_list[0];
     history_res_obj[now_index].logo_rect_list[0] = res.logo_rect_list[0];
     history_res_obj[now_index].logo_type_list[0] = res.logo_type_list[0];
     history_res_obj[now_index].matting_rect_list[0] = res.matting_rect_list[0];
     history_res_obj[now_index].resize_k_list[0] = res.resize_k_list[0];
     history_res_obj[now_index].slogan_rect_list[0] = res.slogan_rect_list[0];
     history_res_obj[now_index].title_color_list[0] = res.title_color_list[0];
     history_res_obj[now_index].txt_sp_list[0] = res.txt_sp_list[0];
}