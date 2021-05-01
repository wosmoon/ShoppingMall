$(function () {

    // 页面初始化：
    // 1.渲染商品列表(完成)
    // 2.点击【添加商品】按钮后，渲染二级分类列表（完成）
    // 3.选择二级分类时，把id给对应的input隐藏区域
    // 4.配置模态框表单校验规则
    // 5.上传图片并得到返回的图片信息


    // 用一个数组来装上传的图片信息
    var picArr = [];

    // 点击按钮显示模态框
    $('.addproduct').click(function () {
        // console.log(132);

        $('#addModal').modal("show");

        // 2.
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            datatype: "json",
            success: function (info) {
                console.log(info);
                // 渲染到模态框二级分类列表
                var tplstr = template('sectpl', info);
                $('#form .dropdown-menu').html(tplstr);
            }

        })
    })




    // 1.
    var currentPage = 1;
    var pagesize = 2;

    render();

    function render() {

        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pagesize
            },
            datatype: "json",
            success: function (info) {
                console.log(info);
                // console.log(pagesize);
                // 1.准备模板字符串，渲染数据
                var tpl = template('tpl', info);
                $('.content tbody').html(tpl);
                // console.log(Math.ceil(info.total/info.size));
                //2.准备分页功能
                $('.pagination').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(info.total / info.size),
                    size: "small",

                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    },
                    // 是否启用提示
                    useBootstrapTooltip: true,
                    // 配置提示文本
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "fist":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "page":
                                return "前往第" + page + "页";
                        }
                    },

                    // 配置中文页码
                    itemTexts: function (type, page, current) {

                        switch (type) {
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "first":
                                return "首页";
                            case "last":
                                return "末页";
                            case "page":
                                return page;
                        }
                    },

                    // // 配置页码样式
                    // itemContainerClass:function(type,page,current){
                    //     if(page==current){
                    //         return "pagecurrent";
                    //     }

                    //     return "pagestyle";

                })
            }
        })
    }

    // 3

    $('.dropdown-menu').on("click", "a", function () {
        // console.log(123);
        // console.log($(this));
        var txt = $(this).text();
        // console.log(txt);
        $('#choosesec').text(txt);

        var id = $(this).parent().data('id');
        // console.log(id);
        $('[name = "brandId"]').val(id);
        // console.log($('[name = "brandId"]'));
    })


    // 4
    $('#form').bootstrapValidator({
        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置校验字段
        fields: {
            // 二级分类id, 归属品牌
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            // 商品名称
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            // 商品描述
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 32-40'
                    }
                }
            },
            // 商品价格
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            // 商品原价
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            // 标记图片是否上传满三张
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });

    // 5.上传图片
    $('#fileupload').fileupload({
        datatype: "json",
        done: function (e, data) {
            console.log(data.result);
            // 1.将获得的图片信息对象放到数组里
            // 2.将获得的图片地址生成一个img字符串放到显示图片的父盒子里
            // 3.判断如果数组的长度等于3,更新校验状态
            var picobj = data.result;
            var picaddr = picobj.picAddr;

            picArr.unshift(picobj);
            $('.img-box').prepend('<img src="' + picaddr + '" width= "100">');

            if (picArr.length > 3) {
                picArr.pop();
                $('.img-box img:last-of-type').remove();
            }

            if (picArr.length == 3) {
                // 更新校验状态
                $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID')
            }


        }
    })

    // 校验成功后发送Ajax请求,成功后关闭模态框,重新渲染页面,重置表单和状态
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();

        console.log(1234);

        var dataall = $("#form").serialize();
        console.log(dataall);

        // brandId=8&proName=werq&proDesc=werq&num=234&size=32-34&oldPrice=1111&price=1223&picStatus=&statu=1

        dataall += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        dataall += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        dataall += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

        $.ajax({
            type: "POST",
            url: "/product/addProduct",
            data: dataall,
            datatype: "json",
            success: function (info) {
                //     console.log(info);
                // }

                if (info.success) {

                $('#addModal').modal('hide');

                currentPage:1;
                render();

                $('#form').data('bootstrapValidator').resetForm(true);
                
                // 手动重置下拉框和图片
                $('.content .choosesec').text('请选择二级分类');
                $('.img-box img').remove();

                }

            }


        })


    })
})