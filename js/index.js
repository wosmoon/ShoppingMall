$(function () {

    // 初始化图标
    var echarts_1 = echarts.init(document.querySelector('.echarts_1'));
    var echarts_2 = echarts.init(document.querySelector('.echarts_2'));

    // 左侧统计人数
    option1 = {
        title: {
            text: "2021年注册人数",
            left: "auto"
        },
        tooltip: {},
        legend: {
            // type: 'plain',
            // orient: 'vertical',
            // right: 10,
            // top: 20,
            // bottom: 20,
            data: ['人数']

            // selected: data.selected
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            name: '人数'
        }]
    };

    // 右侧热门品牌销售
    option2 = {
        title: {
            text: '热门品牌销售',
            // 子标题
            subtext: '2017年6月',
            // 水平居中
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // 图例
        legend: {
            // 垂直排列
            orient: 'vertical',
            // 居左显示
            left: 'left',
            data: ['耐克', '阿迪', '新百伦', '李宁', '阿迪王']
        },
        series: [
            {
                name: '品牌',
                // 饼状图
                type: 'pie',
                // 圆的大小
                radius: '50%',
                // 圆心的位置
                center: ['50%', '60%'],
                data: [
                    { value: 335, name: '耐克' },
                    { value: 310, name: '阿迪' },
                    { value: 234, name: '新百伦' },
                    { value: 135, name: '李宁' },
                    { value: 1548, name: '阿迪王' }
                ],
                itemStyle: {
                    // 设置阴影效果
                    emphasis: {
                        shadowBlur: 30,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 1)'
                    }
                }
            }
        ]
    };

    echarts_1.setOption(option1);
    echarts_2.setOption(option2);

    



})