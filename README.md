# js-calendar
自定义日历

# 使用方法
let calendar = new Calendar({
        id: "holder",
        outMonthClickable: false,//非本月日期是否可点击
        outMonthShowable: true,//非本月日期是否可显示
        mode: "week",//默认模式
        showWeekbar: true,//是否显示weekbar
        weekbarCss: {},//weekbar样式
        mondayToSunday: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],//周一到周日名称
        firstOfWeekIndex: 6,//设置哪一天作为开始(0-6对应周一到周日，默认周日)
    })
    .setDrawItemListener(calendar, date){//如何绘制每个item

    }
    .addOnDateSelectedListener(){//点击item回调

    }
    .addOnMonthChangedListener(){//切换月份回调，仅月模式下可用

    }
    .addOnWeekChangedListener(){//切换周回调，仅周模式下可用

    }
    .addOnModeChangedListeners(){//切换模式时回调

    };
    calendar.show();
    $("#toggle").on("click", function () {
        calendar.toggleMode();//切换模式
    });

    $("#nextMonth").on("click", function () {
        calendar.nextMonth();//下月
    });

    $("#lastMonth").on("click", function () {
        calendar.lastMonth();//上月
    });

    $("#nextWeek").on("click", function () {
        calendar.nextWeek();//上周
    });

    $("#lastWeek").on("click", function () {
        calendar.lastWeek();//上周
    });
