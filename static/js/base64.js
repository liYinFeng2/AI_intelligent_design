var img = "http://10.168.78.79:3000/intelligent-design/img/aa.jpg";//imgurl 就是你的图片路径 
var base_img_width,base_img_height;
var base64; 
function getBase64Image(img) { 
  var maxW = 1000; 
  var canvas = document.createElement("canvas");  
  if (img.width > maxW) {
    img.height *= maxW / img.width;
    img.width = maxW;
  }
  base_image_width = img.width;
  base_image_height = img.height;

  canvas.width = img.width;  
  canvas.height = img.height;  
  var ctx = canvas.getContext("2d");  
  ctx.drawImage(img, 0, 0, img.width, img.height);  
  var ext = img.src;  
  var dataURL = canvas.toDataURL('image/jpeg',ext);  
  return dataURL;  
}  

$(document).ready(function () {
  var image = new Image();  
  image.src = img;  
  image.onload = function(){  
    base64 = getBase64Image(image);  
    $(".resize-image").attr("src", base64); 
  }  
});