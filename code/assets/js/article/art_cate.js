$(function() {
    initArticle()
    var layer = layui.layer
    var form = layui.form

    function initArticle() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('arttlp', res)
                $("tbody").html(htmlStr)
            }
        })
    }
    var addIndex = null
    $('#btnAddCart').on('click', function() {
        addIndex = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ["500px", "250px"],
            content: $('#art-add').html()
        });
    });
    $('body').on('submit', "#form-add", function(e) {
        e.preventDefault(),

            $.ajax({
                method: "POST",
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg("更新文章类别失败")
                    }
                    initArticle()
                    layer.msg("更新文章类别成功")
                    layer.close(addIndex)
                }

            })
    })
    var editIndex = null
    $('tbody').on('click', "#editArt", function() {

        editIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ["500px", "250px"],
            content: $('#art-edit').html()
        });
        var id = $(this).attr("data-index")
            // console.log(id);
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,

            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)

            }

        })

    })


    $('body').on('submit', "#form-edit", function(e) {
        e.preventDefault(),

            $.ajax({
                method: "POST",
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg("修改文章类别失败")
                    }
                    initArticle()
                    layer.msg("修改")



                    layer.close(editIndex)
                }

            })
    })

    $('tbody').on('click', "#deleteArt", function() {
        var id = $(this).attr("data-index")
            // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something

            $.ajax({
                method: "GET",
                url: '/my/article/deletecate/' + id,

                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg("删除类别失败")
                    }
                    initArticle()
                    layer.msg("删除类别成功")
                    layer.close(editIndex)
                }

            })
        });


    })

})