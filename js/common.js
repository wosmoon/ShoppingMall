// 登录拦截
if (location.href.indexOf("login.html") === -1) {
    $.ajax({
        type: "GET",
        url: "/employee/checkRootLogin",
        datatype: "json",
        success: function (info) {
            // console.log(info);
            // if(info.success){

            // }
            if (info.error) {
                location.href = "login.html";
            }
        }
    })
}


// 设置进度条
NProgress.configure({ showSpinner: false });

$(document).ajaxStart(function () {
    NProgress.start();
});

$(document).ajaxStop(function () {
    NProgress.done();
});




$(function () {

    // 侧边栏——分类管理的展开和合上
    $(".category").click(function () {
        $(this).next().stop().slideToggle();
    });

    // 模态框的开启和关闭
    $('.icon_logout').click(function () {
        $('#logoutModal').modal('show');
    });

    //点击按钮实现退出登陆
    $("#logoutBtn").click(function () {
        // console.log("啊啊啊啊");
        $.ajax({
            type: "GET",
            url: "/employee/employeeLogout",
            datatype: "json",
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    location.href = "login.html";
                }
            }
        })
    });

    //点击菜单标签,实现全屏切换
    $('.icon_menu').click(function () {
        // console.log("aaaa");
        $('.It_aside').toggleClass('hidemenu');
        $('.It_main').toggleClass('hidemenu');
        $('.It_topbar').toggleClass('hidemenu');

    })

})

