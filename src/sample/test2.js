define([
    '../core/calendar.js',
], function (Calendar) {
    'use strict';
    let info = [];
    let calendar = new Calendar({
        id: "holder",
        outMonthClickable: false,
        outMonthShowable: true,
        mode: "week"
    })
        .setDrawItemListener(function (calendar, $el, date) {
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
            let seed = calendar.getSeedDate();
            if (seed.getMonth() !== date.getMonth()
                && calendar.isMonthMode()) {
                $el.css({
                    color: "#f1f1f1",
                });
            }
            //绘制选中
            let selectDate = calendar.getSelectDate();
            let isselectDay = date.getDate() === selectDate.getDate()
                && date.getMonth() === selectDate.getMonth()
                && date.getFullYear() === selectDate.getFullYear();
            if (
                (isselectDay && calendar.isMonthMode() && date.getMonth() === calendar.getSeedDate().getMonth())
                ||
                (!calendar.isMonthMode() && isselectDay)
            ) {
                calendar.getElementByDate(date).find(">span").addClass("select");
            }
            //绘制额外信息
            if (info) {
                let rs = info.filter(ele => {
                    return ele.date.getDate() === date.getDate() && ele.date.getMonth() === date.getMonth() && ele.date.getFullYear() === date.getFullYear();
                });
                if (rs && rs.length > 0 && rs[0].date) {
                    let dots = "";
                    for (let i = 0; i < rs[0].cnt; i++) {
                        dots += `
                            <i style="display:inline-block;width:4px;height:4px;margin:1px;border-radius:8px;background-color: rebeccapurple;"></i>
                        `;
                    }
                    $el.append(`
                <i style="width:30px;position:absolute;bottom:-10px;left:calc(50% - 15px);">${dots}</i>
            `);
                }
            }
        })
        .addOnDateSelectedListener(function (calendar, date) {
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
        .addOnMonthChangedListener(function (calendar, seedDate) {
            info = [];
            $("#title").html(seedDate.getFullYear() + "年" + (seedDate.getMonth() + 1) + "月");

            reqRange(calendar, seedDate, function (res) {
                info = res.data;
            });
        })
        .addOnWeekChangedListener(function (calendar, seedDate) {
            $("#title").html(seedDate.getFullYear() + "年" + (seedDate.getMonth() + 1) + "月");
            reqRange(calendar, seedDate, function (res) {
                info = res.data;
                console.log(info);
            });
        })
        .addOnModeChangedListeners(function (isMonthMode) {

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

    function reqRange(calendar, seedDate, callback) {
        let start = new Date(seedDate.getFullYear(), seedDate.getMonth(), 1);
        let end = new Date(seedDate.getFullYear(), (seedDate.getMonth() + 1), 1);
        end.setDate(end.getDate() - 1);
        requestRangeData(
            start,
            end
        ).then(res => {
            if (res.success && calendar.getSeedDate().getMonth() === start.getMonth()) {
                callback && callback(res);
                calendar.draw();
            }
        });
    }

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