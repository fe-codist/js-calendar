define([
    '../core/calendar.js',
], function (Calendar) {
    'use strict';
    let calendar = new Calendar({
        id: "holder",
        outMonthClickable: false,
        outMonthShowable: false,
    })
        .setDrawItemListener(function ($el, date) {
            $el.html(date.getDate());
            $el.css({
                display: "inline-block",
                width: "30px",
                margin: "5px"
            });
        })
        .addOnDateSelectedListener(function (date, lastDate) {
            alert(lastDate);
        });
    calendar.show();

    $("#toggle").on("click",function(){
        calendar.toggleMode();
    });

    $("#nextMonth").on("click",function(){
        calendar.nextMonth();
    });

    $("#lastMonth").on("click",function(){
        calendar.lastMonth();
    });

    $("#nextWeek").on("click",function(){
        calendar.nextWeek();
    });

    $("#lastWeek").on("click",function(){
        calendar.lastWeek();
    });

});