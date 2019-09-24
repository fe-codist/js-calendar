define([
    '../core/calendar.js',
], function (Calendar) {
    'use strict';
    let calendar = new Calendar({
        id: "holder",
        outMonthClickable: false,
        outMonthShowable: true,
    })
        .setDrawItemListener(function (calendar, $el, date) {
            //刷新
            $el.html(date.getDate());
            $el.removeClass();
            $el.css({
                display: "inline-block",
                width: "30px",
                height: "30px",
                margin: "5px",
                color: "black",
                position: "relative"
            });
            let seed = calendar.calculator.getSeedDate();
            if (seed.getMonth() !== date.getMonth()
                && calendar.params.mode === "month") {
                $el.css({
                    color: "#f1f1f1",
                });
            }
            //绘制选中
            // if (date.getDate() === calendar.params.selectDate.getDate()
            //     && date.getMonth() === calendar.params.selectDate.getMonth()
            //     && date.getFullYear() === calendar.params.selectDate.getFullYear()) {
            //     calendar.getElementByDate(date).addClass("select");
            // }
        })
        .addOnDateSelectedListener(function (calendar, date, lastDate) {

            // calendar.getElementByDate(lastDate).removeClass();
            //标记选中，移除非
            // calendar.getElementByDate(date).addClass("select");
            //调用接口

        })
        .addOnMonthChangedListener(function (calendar, seedDate, lastSeedDate) {
            let month = seedDate.getMonth();
            let $el = calendar.getElementByDate(new Date(seedDate.getFullYear(), month, month + 1));
            // $el && $el.append(`
            //     <span style="position:absolute;top:0;right:0">1</span>
            // `);
            $("#title").html(seedDate.getFullYear()+"年"+(seedDate.getMonth()+1)+"月");
        })
        .addOnWeekChangedListener(function (calendar, seedDate, lastSeedDate) {
            // alert(seedDate.getDate());
            $("#title").html(seedDate.getFullYear()+"年"+(seedDate.getMonth()+1)+"月");
        });
    calendar.show();

    $("#toggle").on("click", function () {
        calendar.toggleMode();
    });

    $("#nextMonth").on("click", function () {
        calendar.nextMonth();
    });

    $("#lastMonth").on("click", function () {
        calendar.lastMonth();
    });

    $("#nextWeek").on("click", function () {
        calendar.nextWeek();
    });

    $("#lastWeek").on("click", function () {
        calendar.lastWeek();
    });

});