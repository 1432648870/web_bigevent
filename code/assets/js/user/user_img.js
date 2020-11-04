$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        // 让选择上传的input隐藏
    $('#chooseImg').hide()
        // 为上传按钮模拟选择图片的input--file
    $("#btnChooseImg").on("click", function() {
        $("#chooseImg").click();
    })
    $('#chooseImg').on('change', function(e) {
            console.log(111);
            // console.log(e);
            // 拿到用户选择的文件
            var fileList = e.target.files[0]
                // console.log(fileList);
                // 将文件转化为路径
            var ImgURL = URL.createObjectURL(fileList)
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', ImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域

        })
        // 上传头像
    $('#okImg').on('click', function() {
        // console.log(111);
        // 1.拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 2调用接口   把头像上传到服务器
        $.ajax({
            url: "/my/update/avatar",
            method: "POST",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更换头像失败！")
                }
                layui.layer.msg("更换头像成功！")
                    // 渲染index页面上的内容   调用index.js的方法
                window.parent.getUserInfo()
            }

        })
    })
})