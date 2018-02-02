let history_size_arr = [];   //记录选择或者删除的历史尺寸信息
let history_res_obj = [];    //记录历史尺寸对应的详细信息

let base_image_width;        //原始背景图压缩后的宽
let base_image_height;       //原始背景图压缩后的高

let file_url;               //后台参数 img
let titles_list;            //后台参数 titles_list
let size_list;              //后台参数 size_list
let resize_k_list;          //后台参数 resize_k_list
let logo_type_list = [];    //后台参数 logo_type_list


let logo_one_result = [];        //第一次请求时，进行赋值,防止后期进行多次重复操作
let logo_type_choise_list = [];  //当前选择的logo图标



let now_index_id; //当前选择的尺寸




