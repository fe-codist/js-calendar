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
            $el.closest("div").css({
                "display": "flex",
            });
            //刷新
            $el.css({
                "flex": "1",
                display: "flex",
                width: "max-content",
                height: "40px",
                margin: "5px",
                color: "black",
                position: "relative",
                "text-align": "center",
                "cursor": "pointer",
                "align-items": "center",
                "justify-content": "center"
            });
            $el.html(`
                <span style="display:inline-block;">${date.getDate()}</span>
            `);
            $el.find(">span").removeClass("select");
            let seed = calendar.calculator.getSeedDate();
            if (seed.getMonth() !== date.getMonth()
                && calendar.params.mode === "month") {
                $el.css({
                    color: "#f1f1f1",
                });
            }
            //绘制选中
            if (date.getDate() === calendar.params.selectDate.getDate()
                && date.getMonth() === calendar.params.selectDate.getMonth()
                && date.getFullYear() === calendar.params.selectDate.getFullYear()
                && calendar.params.selectDate.getMonth() === calendar.calculator.getSeedDate().getMonth()) {
                calendar.getElementByDate(date).find(">span").addClass("select");
            }
        })
        .addOnDateSelectedListener(function (calendar, date, lastDate) {
            calendar.getElementByDate(lastDate) && calendar.getElementByDate(lastDate).find(">span").removeClass();
            //标记选中，移除非
            calendar.getElementByDate(date).find(">span").addClass("select");
            //调用接口
            $("#title").html(date.getFullYear() + "年" + (date.getMonth() + 1) + "月");
            requestDay(date).then(res => {
                if (date.getFullYear() === calendar.params.selectDate.getFullYear()
                    && date.getMonth() === calendar.params.selectDate.getMonth()
                    && date.getDate() === calendar.params.selectDate.getDate()) {

                    if (res.success) {
                        let html = "";
                        res.data.forEach(ele => {
                            html += `
                                <li>${ele.text}</li>
                            `;
                        });

                        $("#content").html(`
                            <ul>${html}</ul>
                        `);
                    }
                }
            });
        })
        .addOnMonthChangedListener(function (calendar, seedDate, lastSeedDate) {
            let month = seedDate.getMonth();
            $("#title").html(seedDate.getFullYear() + "年" + (seedDate.getMonth() + 1) + "月");
            let start = new Date(seedDate.getFullYear(), seedDate.getMonth(), 1);
            let end = new Date(seedDate.getFullYear(), (seedDate.getMonth() + 1), 1);
            end.setDate(end.getDate() - 1);
            requestRangeData(
                start,
                end
            ).then(res => {
                if (res.success && calendar.calculator.getSeedDate().getMonth() === start.getMonth()) {
                    res.data.forEach(ele => {
                        let $el = calendar.getElementByDate(ele.date);
                        let dots = "";
                        for (let i = 0; i < ele.cnt; i++) {
                            dots += `
                                <i style="display:inline-block;width:4px;height:4px;margin:1px;border-radius:4px;background-color: rebeccapurple;"></i>
                            `;
                        }
                        $el.append(`
                            <i style="width:30px;position:absolute;bottom:-10px;left:calc(50% - 15px);">${dots}</i>
                        `);
                    });
                }
            });

        })
        .addOnWeekChangedListener(function (calendar, seedDate, lastSeedDate) {
            $("#title").html(seedDate.getFullYear() + "年" + (seedDate.getMonth() + 1) + "月");
        })
        .setDrawTitleListener(function (calendar, seedDate) {
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

    function requestDay(date) {
        let res = {
            success: true,
            data: []
        };
        for (let i = 0; i < 5; i++) {
            res.data.push({
                text: date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日有" + parseInt(Math.random() * 100) + "条消息"
            });
        }
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(res);
            }, 2000);
        })
    }

    function requestRangeData(startDate, endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        let res = {
            success: true,
            data: []
        }
        for (let i = 0; i < 3; i++) {
            res.data.push({
                date: new Date(start),
                cnt: i + 1
            });
            start.setDate(start.getDate() + 1);
        }
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(res);
            }, 1000);
        });
    }
});