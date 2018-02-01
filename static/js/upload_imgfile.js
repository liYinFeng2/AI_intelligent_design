/*
说明:点击上传图片的按钮，更换背景图
       
    需要判断是否选择过尺寸，有的话需要重新请求，否则更换背景图
      
    查看记录点击历史的变量即可
*/



$(".upload-file").on("change","input[type='file']",function(){
    let filePath = $(this).val();
    if(filePath.indexOf("jpg") != -1 || filePath.indexOf("png") != -1){
      let arr = filePath.split('\\');
      let fileName = arr[arr.length-1];
      $(".filename").val(fileName);      
    }else{
      alert("您上传文件类型有误!");
      return false; 
    }
});


let input_upload = document.getElementById('upload');
input_upload.addEventListener('change',show_uploadImage,false);

function show_uploadImage(){
    let file = this.files[0];
    if(!/image\/\w+/.test(file.type)){
		alert("文件必须为图片！");
		return false;
	}
	let reader = new FileReader();
    reader.readAsDataURL(file);    
	reader.onload = function(e){
        let img_url = this.result;
        let canvas = document.getElementById('aa');
        context = canvas.getContext('2d');
        let img = new Image();
        let max_width = 1000;

        img.src = img_url;
        img.onload = function(){
            //console.log('width = '+img.width,'height = '+img.height)
            if(img.width > max_width){
                img.height *= max_width / img.width;
                img.width = max_width;
            }
            canvas.width = img.width;
            canvas.height = img.height;

            //设置全部变量
            base_image_width = img.width;
            base_image_height = img.height;
            
            context.clearRect(0,0,base_image_width,base_image_height);
            context.drawImage(img,0,0,base_image_width,base_image_height);
            let image_data_url = canvas.toDataURL('image/jpeg',0.9);

            //更换背景图之前确认是否点选过尺寸
            if(history_size_arr.length == 0){   //没有点选过尺寸
                $("#resize-image").attr('src',image_data_url);
            }else{                              //反之
                $("#resize-image").attr('src',image_data_url);
                change_background_image(image_data_url);
            }
            
        }
	}
}


















