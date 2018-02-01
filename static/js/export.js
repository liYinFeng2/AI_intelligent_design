// $(function () {
//     $("#slider").responsiveSlides({
//         auto: false,
//         pager: false,
//         nav: true,
//         speed: 500,
//         // 对应外层div的class : slide_container
//         namespace: "slide"
//     });
// });

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

$(function () {
    var arr = [];
    $('.car-img').each(function () {
        //arr.push($(this).attr('src'));
        var obj = {
            src: $(this).attr('src'),
            title: $(this).attr('title')
        };
        arr.push(obj)
    })
    //console.log('arr:', arr);

    $("#out-btn").click(function () {
        arr.map(function (i) {
            outDownLoad.click(oDownLoad(i.src,i.title));
        });
    });
});


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


/*
function downloadFile(fileName, content){

    var aLink = document.createElement('a');
    var blob = base64Img2Blob(content); //new Blob([content]);

    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);

    aLink.dispatchEvent(evt);
}
downloadFile('ship.png', canvas.toDataURL("image/png"));
*/
