$(function () {
    // 基础功能
    // 1.渲染表格
    // 2.实现分页效果
    // 3.添加分类功能


    // 1.点击显示模态框
    // 渲染一级分类数据

    $('.content .btn').click(function () {
        // console.log
        $('#addModal').modal('show');

        $.ajax({
            type: "GET",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            datatype: "json",
            success: function (info) {
                console.log(info);
                // 准备模板字符串然后渲染
                var toptpl = template("toptpl", info);
                $('.dropdown-menu').html(toptpl);


            }

        })
    })

    var currentpage = 1;
    var pagesize = 5;

    // 2.渲染页面和分页器
    render();

    function render() {
        $.ajax({
            type: "GET",
            url: "/category/querySecondCategoryPaging",
            datatype: "json",
            data: {
                page: currentpage,
                pageSize: pagesize
            },
            success: function (info) {
                console.log(info);
                // 准备模板字符串
                var tplstr = template("tpl", info)
                $('.content tbody').html(tplstr);

                // 准备分页器
                $('.pagination').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentpage,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        currentpage = page;
                        render();
                    }

                })

            }
        })
    }

    // 3.实现添加二级分类

    // 3.1实现选择并显示一级分类
    $('.dropdown-menu').on('click', 'li', function () {
        // 把选中的名字显示
        var topname = $(this).text();
        // console.log(topname);
        $('#choosetop').text(topname);
        // 把选中的id复制给隐藏区域，便于后期提交表单
        var id = $(this).data("id");
        console.log(id);
        $('[name = "categoryId"]').val(id);

        // 手动修改选择一级分类后的状态
        $('#form').data('bootstrapValidator').updateStatus("categoryId","VALID");

    })

    // 3.2实现上传并获得图片地址并显示图片
    $('#fileupload').fileupload({
        dataType: "json",
        done: function (e, data) {
            console.log(data);
            // 把图片地址交给img去显示
            $('#form img').attr("src", data.result.picAddr);
            // 把图片地址赋值给input便于后期提交表单
            $('[name="brandLogo"]').val(data.result.picAddr);

            // 手动更新校验状态
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');

        }
    })

    // 4.表单校验
    $('#form').bootstrapValidator({
        // 排除限制
        excluded: [],
        // 设置状态对应图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields: {
            brandName: {
                validators: {
                    notEmpty:{
                        message: "请输入二级分类标题"
                    }
                }

            },
            categoryId: {
                validators: {
                    notEmpty:{
                        message: "请选择分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty:{
                        message: "请选择图片"
                    }
                }
            }
        }
    })

    // 5.隐藏域无法检测到内容的变化，需要手动修改状态

    // 6.校验成功后，发送ajax
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
        $.ajax({
            type:"POST",
            url:"/category/addSecondCategory",
            data:$('#form').serialize(),
            datatype:"json",
            success:function(info){
                // console.log(info);
                // 重新渲染第一页
                currentpage = 1;
                render();
                // 重置表单状态和内容
                $('#form').data('bootstrapValidator').resetForm();
            }

        })
    })


})