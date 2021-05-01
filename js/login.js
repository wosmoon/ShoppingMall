$(function () {

    // 配置登陆表单校验规则
    $('#form').bootstrapValidator({

        // 配置图标
        feedbackIcons: {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-repeat"

        },
        // 配置字段规则：区域——name——规则——具体规则
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: "不能为空"
                    },
                    stringLength: {
                        max: 12,
                        min: 3,
                        message: "长度需要在3-12"
                    },
                    callback:{
                        message:"您输入的账号有误"
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: "不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "长度需要在6-12位"
                    },
                    callback:{
                        message:"您输入的密码有误"
                    }
                }

            }
        }
    })

    // 重置表单
    $('[type="reset"]').click(function () {
        // console.log("触发事件了");
        $('#form').data("bootstrapValidator").resetForm();
    });

    // 实现登陆功能
    // 表单验证成功之后，阻止默认提交，使用ajax进行提交处理
    $('#form').on('success.form.bv', function (e) {
        // console.log(111);
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $('#form').serialize(),
            datatype: "json",
            success: function (info) {
                // console.log(info);
                // 登录成功后跳转
                if (info.success) {
                    location.href = "index.html";
                }
                // 密码错误
                if (info.error === 1001) {
                    $('#form').data('bootstrapValidator').updateStatus("password","INVALID","callback")
                }
                // 账号不存在
                if (info.error === 1000) {
                    $('#form').data('bootstrapValidator').updateStatus("username","INVALID","callback")
                }
            }
        })
    });



})