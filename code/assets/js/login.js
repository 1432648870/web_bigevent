$(function() {
    $("#link-reg").on('click', function() {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link-login").on('click', function() {
            $(".login-box").show();
            $(".reg-box").hide();

        })
        // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
        //通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个叫pwd校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $(".reg-box [name=password]").val()
            if (pwd !== value) {
                return "两次输入密码不一致!"
            }
        }
    })

    // 为注册页面监听事件
    $("#regForm").on('submit', function(e) {
            // 阻止表单的默认行为
            e.preventDefault()
            var data = {
                username: $('#regForm [name=username]').val(),
                password: $('#regForm [name=password]').val()

            }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("注册成功！去登录")
                $('#link-login').click()
            })

        })
        // 为登录页面监听事件
    $("#loginForm").submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败")
                }
                // console.log(res.token);
                localStorage.setItem('token', res.token)
                layer.msg("登录成功")
                location.href = "index.html"
            }
        })
    })
})