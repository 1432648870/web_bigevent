$(function() {
    getUserInfo()
    var layer = layui.layer
    $('#outLogin').on('click', function() {
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 删除本地存储的用户信息
            localStorage.removeItem('token')
                // 让页面跳转到登录页面
            location.href = 'login.html'
                // 关闭页面询问框
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败")
            }

            randerAvatar(res.data)
        },
        // 服务器响应回来的数据   不但有success函数   还有error   还有complete  
        // 不管请求成功还是失败  最终都会调用complete回调函数
        // complete: function() {

        //     // console.log(res);
        //     // 在complete回调函数中  可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = 'login.html'
        //     }
        // }

    })
}

function randerAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
        // 2.设置欢迎的文本
    $(".welcome").html("欢迎&nbsp;&nbsp" + name)
        //    3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $(".text-avatar").hide();
    } else {
        // 渲染文本头像  当该户用没有头像时   将该用户的昵称的首字母大写  放入text-avatar中
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()

    }
}