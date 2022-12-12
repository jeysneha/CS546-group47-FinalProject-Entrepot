// 新建表单数据对象，用来存储上传的文件及上传的其它数据

let fileInput = document.getElementById('file');
let submit = document.getElementById("submit");
let info = document.getElementById('info');
let preview = document.getElementById('image-preview');
let param = new FormData()
// 监听change事件:
fileInput.addEventListener('change', function() {
    // 清除背景图片:
    preview.style.backgroundImage = '';
    if (!fileInput.value) {
        info.innerHTML = '没有选择文件';
        return;
    }
    let file = fileInput.files[0];
    let size = file.size;
    if (size >= 1 * 1024 * 1024) {
        alert('文件大小超出限制');
        info.innerHTML = '文件大小超出限制';
        return false;
    }
    // 获取File信息:
    info.innerHTML = `文件名称:  + ${file.name}<br>文件大小: ${file.size} <br>上传时间: ${file.lastModifiedDate}`;
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('不是有效的图片文件!');
        return;
    }
    // 读取文件:
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = e.target.result;
        console.log(preview, 'a标签')
        preview.src = data
    };
    // 以DataURL的形式读取文件:
    reader.readAsDataURL(file);

    //"file"为前后端约定vb的属性名
    param.append("file",file)
    // alert(param)

});


// 新建表单数据对象，用来存储上传的文件及上传的其它数据

 
// $(".file").onchange = function(){
//     //获取图片信息
    
// }
submit.onclick = function() {
    alert(param);
    axios.post("/product",param,{
        headers: {
            // 默认提交的类s型
            // "content-type": "application/json"
            // 复杂的表单数据(只要上传文件，就必须是下面的类型)
            "content-type": "multipart/form-data"
        }
    })
    .then((res)=>{
        console.log(res.data);
    })
};
// $(".add-btn").onclick = function(){
//     // let productName = $(".productName").value;
//     // let price = $(".price").value;
//     // param.append("productName",productName)
//     // param.append("price",price)
    
// }
