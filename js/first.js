$(function () {

    var currentpage = 1;
    var pagesize = 2;
    // 首先：对表格的内容进行渲染

    render();

    function render() {
        $.ajax({
            type: "GET",
            url: "/category/queryTopCategoryPaging",
            datatype: "json",
            data: {
                page: currentpage,
                pageSize: pagesize
            },
            success: function (info) {
                console.log(info);
                var tplstr = template('tpl', info);
                $('.content tbody').html(tplstr);

                // 还有绑定同步分页功能
                $('.pagination').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentpage,
                    totalPages: Math.ceil(info.total/info.size),
                    size: "small",
                    onPageClicked: function (a, b, c, page) {
                        currentpage = page;
                        render();
                    }
                })
            }
        })
    }


    //1.点击添加分类按钮，弹出添加分类的模态框
    $('.addcate').click(function () {
        // console.log(11112);
        $('#addModal').modal('show');
    })

    // 2.对模态框中的内容进行校验
    $('#form').bootstrapValidator({

        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "内容不能为空哦"
                    }
                }
            }
        }
    })

    // 3.校验成功后提交数据，提交数据成功后关闭模态框，重新渲染页面，重置校验状态
    $('#form').on('success.form.bv',function(e){
        // console.log(123455344);
        // e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type:"POST",
            url:"/category/addTopCategory",
            data:$('#form').serialize(),
            datatype:"json",
            success:function(info){
                // console.log(info);
                if(info.success){
                    $('#addModal').modal('hide');
                    render();
                }

            }
        })

    })


})