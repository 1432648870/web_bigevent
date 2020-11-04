$(function() {
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value > 6) {
                return "昵称长度必须在1~6个字符之间"
            }
        }
    })
    getUserInfo()
        // 获取用户信息
    function getUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("获用户信息失败")
                }
                // 调用layui中的form中的val()方法  为表单赋值
                form.val("userInfoForm", res.data)
            }
        })
    }
    $("#resetUser").on('click', function(e) {
        // 阻止重置的默认事件  防止将所有信息都重置
        e.preventDefault()
        getUserInfo()
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新用户信息失败")
                }

                layui.layer.msg("更新用户信息成功")
                    // 调用index页面中的获取用户信息的函数
                window.parent.getUserInfo()
            }

        })
    })

})