define([
    "jquery",
    "./calculator"
], function ($, Calculator) {
    const uuid = 1;
    const ID_CALENDAR = "calendar_body_" + uuid;
    const CLASS_ROW = "row-" + uuid;

    function Calendar(opts) {
        this.params = {
            id: undefined,
            mode: "week",
            outMonthClickable: false,
            outMonthShowable: false,
            mondayToSunday: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            firstOfWeek: "",
            firstOfWeekIndex: 6,
            seedDate: new Date(),
            selectDate: new Date()
        };
        Object.assign(this.params, opts);
        //监听
        this.onMonthChangedListeners = [];
        this.onWeekChangedListeners = [];
        this.onDateSelectedListeners = [];
        this.onModeChangedListeners = [];
        //日历计算器
        this.calculator = new Calculator();

        //构建html
        $("#" + this.params.id).html(calendarHtml());
    }

    function calendarHtml() {
        let calendar = "";
        for (let i = 0; i < 6; i++) {
            let row = "";
            for (let j = 0; j < 7; j++) {
                row += `<span></span>`;
            }
            row = `
                <div class=${CLASS_ROW}>
                    ${row}
                </div>
            `;
            calendar += row;
        }
        calendar = `
            <div id=${ID_CALENDAR}>
                ${calendar}
            </div>
        `;
        return calendar;
    }

    Calendar.prototype.setConfig = function (config) {
        this.config = config;

        return;
    }

    Calendar.prototype.setDrawItemListener = function (listener) {
        this.drawItemListener = listener;
        return this;
    }

    Calendar.prototype.addOnMonthChangedListener = function (listener) {
        this.onMonthChangedListeners.push(listener);
        return this;
    }

    Calendar.prototype.addOnWeekChangedListener = function (listener) {
        this.onWeekChangedListeners.push(listener);
        return this;
    }

    Calendar.prototype.addOnDateSelectedListener = function (listener) {
        this.onDateSelectedListeners.push(listener);
        return this;
    }

    Calendar.prototype.addOnModeChangedListener = function (listener) {
        this.onModeChangedListeners.push(listener);
        return this;
    }

    Calendar.prototype.toggleMode = function () {

    }

    Calendar.prototype.nextMonth = function () {

    }

    Calendar.prototype.lastMonth = function () {

    }

    Calendar.prototype.nextWeek = function () {

    }

    Calendar.prototype.lastWeek = function () {

    }

    Calendar.prototype.show = function () {
        this.calculator.setStartWeek(this.params.firstOfWeekIndex).setSeedDate(this.params.seedDate).calculate();
        let monthMatrix = this.calculator.getMonthMatrix();
        //绘制 & 点击监听
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let $el = $("#" + ID_CALENDAR).find(`>.${CLASS_ROW}:nth(${i + 1})>span:nth(${j + 1})`);
                let date = monthMatrix[i][j];
                //绘制
                //月模式下，如果月面板可见 或 月面板不可见且seed和目标格子日期一致 则绘制
                (
                    this.params.mode === "month"
                    &&
                    (
                        this.params.outMonthShowable
                        ||
                        (
                            date.getMonth() === this.params.seedDate.getMonth()
                            &&
                            this.params.seedDate.getFullYear() === date.getFullYear()
                        )
                    )
                )
                    ||
                    (this.params.mode === "week")//周模式下都可见
                    && this.drawItemListener
                    && this.drawItemListener($el, date);

                //监听
                $el.on("click", event => {
                    (
                        (
                            this.params.mode === "month"
                            &&
                            (
                                (this.params.outMonthShowable && this.params.outMonthClickable)
                                ||
                                (
                                    date.getMonth() === this.params.seedDate.getMonth()
                                    &&
                                    this.params.seedDate.getFullYear() === date.getFullYear()
                                )
                            )
                        )//月模式
                        ||
                        (
                            this.params.mode === "week"
                        )//周模式
                    )
                        &&
                        (
                            this.onDateSelectedListeners
                            &&
                            (this.onDateSelectedListeners.forEach(listener => {
                                listener && listener(new Date(date), new Date(this.params.selectDate));
                            }) || true)
                            &&
                            (this.params.selectDate = date)
                        )
                });
            }
        }
    }

    //*************************************************************************************************/
    function test() {
        let c = new Calendar({
            id: undefined,
            mode: "week",
            outMonthClickable: false,
            outMonthShowable: false,
            mondayToSunday: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            firstOfWeek: "",
            firstOfWeekIndex: 0,
            seedDate: new Date(),
            selectDate: new Date()
        })
            .setDrawItem(function (el, date) {

            })
            .addOnMonthChangedListener(function (calendarMatrix, currentSeed, lastSeed) {
                //重刷标题
                //重刷日历面板
                //业务逻辑：获取数据，将获取结果
                request(month).then(res => {
                    if (requestDate === calendarMatrix.date) {
                        res.data.each(date => {
                            $(calendarMatrix.getElementByDate(date)).find(".day").html("<div>有消息</div>");
                        });
                    }
                });
            })
            .addOnWeekChangedListener(function (calculator, currentSeed, lastSeed) {
                //重刷标题
                //重刷日历面板
                //业务逻辑：获取数据，将获取结果
            })
            .addOnDateSelectedListener(function (selectDate, lastDate) {
                //公有逻辑
                // this.params.selectDate = selectDate;

                //业务逻辑
                request()
                    .then(res => {
                        if (requestDate === calendar.params.selectDate) {
                            //处理逻辑
                        }
                    });
            })
            .addOnModeChangedListener(function (isMonth) {

            })
            .show(id);
        c.toggleMode();
        c.nextMonth();
        c.lastMonth();
        c.lastWeek();
        c.nextWeek();

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
            .addOnMonthChangeListener(function (calendarMatrix, currentSeedDate, lastSeedDate) {
                //计算

                //重刷标题

                //重刷日历面板

                //更新选中状态

                //业务逻辑：获取数据，将获取结果
            })
            .addOnDateSelectedListener(function (calendarMatrix, currentDate, lastDate) {
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