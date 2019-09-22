define([
    "https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"
], function ($) {
    function Calendar() {

    }

    Calendar.prototype.setConfig = function (config) {
        this.config = config;

        return;
    }

    Calendar.prototype.calcDateMatrix = function () {

    }
    

    //应用层

    //核心计算层

    //配置层


    //*************************************************************************************************/
    function test() {
        new Calendar()
            .setMode(MODE_WEEK)
            .setOutMonthClickable(false)
            .setOutMonthShowable(false)
            .setMondayToSunday(["周一", "周二", "周三", "周四", "周五", "周六", "周日"])
            .setFirstOfWeek("周一")//与下2选1
            .setFirstOfWeekIndex(0)//与上2选1
            .addOnDateRangeChangedListener(function (calendarMatrix) {
                //计算

                //重刷标题

                //重刷日历面板

                //业务逻辑：获取数据，将获取结果
                //月模式
                cache ? cache : requestCalendar().then(res => {
                    if (requestDate === calendarMatrix.date) {//请求日期等于日历当前展示
                        res.data.each(date => {
                            $(calendarMatrix.getElementByDate(date)).find(".day").html("<div>有消息</div>");
                        });
                    }
                });
                //周模式
                cache ? cache : requestCalendar().then(res => {
                    if (requestDate === calendarMatrix.date) {//请求日期等于日历当前展示
                        res.data.each(date => {
                            $(calendarMatrix.getElementByDate(date)).find(".day").html("<div>有消息</div>");
                        });
                    }
                });
            })
            .addOnWeekChangedListener(function () {

            })
            .addOnMonthChangeListener(function (calendarMatrix,currentSeedDate,lastSeedDate) {
                //计算

                //重刷标题

                //重刷日历面板

                //更新选中状态

                //业务逻辑：获取数据，将获取结果
            })
            .addOnDateSelectedListener(function (calendarMatrix,currentDate,lastDate) {
                $(calendarMatrix.getElementByDate(currentDate)).css();
                $(calendarMatrix.getElementByDate(lastDate)).css();
            })

            .addTitleAction(id, howShowTitle)
            .removeTitleAction(id)
            .addLastAction(id, haoLast)
            .removeLastAction(id)
            .addNextAction(id, howNext)
            .removeNextAction(id)

            .addModeToggleAction(id, howToggle)
            .removeModeToggleAction(id)

            .addWeekBarAction(id, function () {

            })
            .removeWeekBarAction(id)

            .setCalendar(id, function (calendarMatrix) {

            })
            .show();
    }

    return Calendar;

});