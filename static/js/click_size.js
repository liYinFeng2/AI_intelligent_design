

//1: 点击右侧尺寸列表
$(document).on('click',".setjob-content .sel-size ul li:not(.seemore)",function(){
	//添加样式
	if(!$(this).hasClass("active")){
		$(this).addClass('active');
	}else{
		$(this).removeClass('active')
    }
    
    //获取尺寸数组
    let tempSize = $(this).attr('size').split(',');

    //页面展示
    if($(this).hasClass('active')){
        //全局变量赋值  -- 历史值
        history_size_arr.push(tempSize);
        
        now_index_id = tempSize[0]+'_'+tempSize[1];
        $('.design_container img').hide();
		$('.overlay').removeClass('design_img');
        $('.design_content').append('<div class="design_overlay"><div class="overlay design_img" id="'+now_index_id+'"></div></div><br/>');
        
        choise_or_delete_size(tempSize);

    }else{
        //全局变量赋值  -- 历史值
        history_size_arr.forEach(function(item,index){
            if(item[0] == tempSize[0] && item[1] == tempSize[1]){
                history_size_arr.splice(index,1);
                history_res_obj.splice(index,1);
            }
        });

        let idname = tempSize[0]+'_'+tempSize[1];
        $(".design_content #"+idname).remove();
        
        //console.log('历史值 history_size_arr',history_size_arr);
        //console.log('历史值 history_res_obj',history_res_obj);
    }
});


