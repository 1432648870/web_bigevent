$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Data(data)
        var year = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return year + '-' + m + '-' + d + " " + hh + ":" + mm + ":" + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定4义一个查询的参数对象  将来请求数据的时候   
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值  默认请求第一页的数据
        pagesize: 2, //每页显示几条数据   默认每页显示两条
        cate_id: '', //文章分类的 Id
        state: '', //文章的发布状态

    }
    initArtList()
        // 获取文章列表数据的方法
    function initArtList() {
        // console.log(111);
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res.data);
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败")
                }
                // console.log(222);
                var htmlStr = template('artList', res)
                console.log(htmlStr);
                $("tbody").html(htmlStr)
                    // form.render()
                renderPage(res.total)
            }

        })
    }
    initCate()
        //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取类别失败")
                }
                var htmlCate = template('artCate', res)
                console.log(htmlCate);
                $('[name=cate_id]').html(htmlCate)
                form.render()
            }
        })
    }
    // 为筛选表单绑定提交事件
    $('#cateArt').on('submit', function(e) {
            e.preventDefault()
            var cate_id = $('[name=cate_id]').val();
            var state = $('[name=state]').val();
            q.cate_id = cate_id;
            q.state = state
            initArtList()

        })
        // 渲染分页的方法 
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.render（）方法来渲染分页的结构
        laypage.render({
            // 分页容器id   不需要加#
            elem: 'pageBox',
            // 总数据条数
            count: total,
            // 每页显示几条数据
            limit: q.pagesize,
            // 设置默认选中的分页
            curr: q.pagenum,
            // 当设置了limit属性时  limits才会生效
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候   触发jump回调
            // 触发jump回调的方法有两种：
            //1.点击页码的时候  会触发jump回调

            //2.只要调用了laypage.render()方法 就会触发jump回调
            jump: function(obj, first) {
                // 可以通过first的值  来判断是通过哪种方式    触发·的·jump回调
                console.log(first);
                console.log(obj.curr);
                // 把最新的页码值 赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条目数   赋值到q这个查询参数对象 的pagesize属性中（点击一次就会发生jump回调）  
                q.pagesize = obj.limit
                if (!first) {
                    // 根据最新的q获取对应的数据列表并渲染表格
                    initArtList()
                }

            }
        });
    }
    // 通过代理的形式 为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '#DelListArt', function() {
        // 获取当前页删除按钮的个数
        var len = $("#DelListArt").length
        console.log(len);
        var id = $(this).attr('data-index')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功')
                        // 当数据删除完成之后 需要判断当前这一页中是否还有剩余

                    // 的数据  如果没有剩余的数据 则让页码值-1之后   在调用

                    // initArtList()方法
                    if (len === 1) {
                        // 如果len等于1证明删除完毕之后 页面上就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initArtList()
                }
            })

            layer.close(index);
        });
    })
})