/*
  说明:此文件是页面点击的效果文件
       

*/





/*说明:部分人点击时，点击无效，现在先屏蔽掉,让对勾一直显示*/
  
//编辑标题栏 - 鼠标获得焦点
// $('.title').on('focus',function(){
// 	$(this).next().show();
// });
// //编辑标题栏 - 鼠标失去焦点
// $('.title').on('blur',function(){
// 	$(this).next().hide();
// });



//点击向下小箭头收拉菜单
$(document).on('click','.fa-chevron-down',function(){
	var name = $(this).attr('name');
	$('.'+name+'Box').hide();
	$(this).attr('class','fa fa-chevron-up');
	if(name == 'box1Btn'){
		$(".main-title").css('height','30px');
	}
	
});

//点击小箭头收拉菜单
$(document).on('click','.fa-chevron-up',function(){
	var name = $(this).attr('name');
	$('.'+name+'Box').show();
	if(name == 'box3Btn'){
		$('[boxname="common-usesize"]').addClass('active');
		$('[boxname="user-definedsize"]').removeClass('active');
		$('.user-definedsize').hide();
	}else if(name == 'box1Btn'){
		$(".main-title").css('height','auto');
	}
	$(this).attr('class','fa fa-chevron-down');
});


//常用尺寸- 自定义尺寸   Tab切换
$(".size-group div").click(function(){
	$(this).addClass('active').siblings().removeClass('active');
	$(".sizebox").hide();
	var boxName = $(this).attr('boxname');
	$("."+boxName).show();
});

//常用尺寸收拉
$(".seemore").click(function(){
	var textContent = $(this).text();
	if(textContent == '查看更多'){
		$(".sizeflaghide").show();
		$(this).text('收起');
	}else if(textContent == '收起'){
		$(".sizeflaghide").hide();
		$(this).text('查看更多');
	}  		  		
});

//选择字体
$('[name="fontname"]').click(function(){
	$(".font-list").toggle();
});
$(".font-list li").click(function(){
	$('[name="fontname"]').val($(this).text());
	$(".font-list").hide();
});

//自定义尺寸
$(".addsize").click(function(){
	
	var sizewidth = $(".size-width").val();
	var sizeheight = $(".size-height").val();
	$(".definedsizeList").append('<li size='+sizewidth+','+sizeheight+' class="active"><span>'+sizewidth+'*'+sizeheight+'px</span><span class="deletesize">×</span></li>');
	$(".size-width").val('');
	$(".size-height").val('');
	
	let define_size = [sizewidth,sizeheight];
	history_size_arr.push(define_size);
        
	now_index_id = define_size[0]+'_'+define_size[1];
	$('.design_container img').hide();
	$('.overlay').removeClass('design_img');
	$('.design_content').append('<div class="design_overlay"><div class="overlay design_img" id="'+now_index_id+'"></div></div><br/>');
	
	choise_or_delete_size(define_size);

});

