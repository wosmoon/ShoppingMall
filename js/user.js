$(function () {
    // 发送ajax请求数据,然后渲染到页面上
    var currentpage = 1;
    var pagesize = 5;

    render();

    function render() {
        $.ajax({
            type: "GET",
            url: "/user/queryUser",
            data: {
                page: currentpage,
                pageSize: pagesize
            },
            datatype: "json",
            success: function (info) {

                // var currentPage
                console.log(info);
                var tplstr = template('tpl', info);
                $(".content tbody").html(tplstr);

                // 分页按钮
                $(".pagination").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentpage,
                    totalPages: Math.ceil(info.total / pagesize),
                    size: "small",
                    // 页码点击事件
                    onPageClicked: function (a, b, c, page) {
                        currentpage = page;
                        render();
                    }
                })
            }
        })
    }

    // 分页逻辑梳理:
    // 1.页面初始化时,获取成功数据后,根据数据配置现在的页码和总页码
    // 2.在配置页码点击事件的时候,最后一个参数是获取到用户点击的页码数,把它复制给currentpage,然后重新渲染页面


    // 实现管理员账号禁用和启用功能
    // 1.点击禁用启用功能，显示模态框（使用事件委托）
    $('.content tbody').on('click', 'a', function () {
        $('#userModal').modal("show");
        // console.log('1111');

        var id = $(this).parent().data("id");
        // console.log(id);
        var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;

        // 当点击模态框的确认时发送ajax，注意避免重复绑定事件
        $('#userModal #submitBtn').off('click').on('click', function () {
            // console.log(124124);
            $.ajax({
                type: "POST",
                url: "/user/updateUser",
                data: {
                    id: id,
                    isDelete: isDelete
                },
                datatype: "json",
                success: function (info) {
                    // console.log(info);
                    // 成功后需要做的事情：1.重新渲染页面 2.关闭模态框
                    $('#userModal').modal('hide');

                    render();
                }
            })
        })

    })



})