define(["jquery", "./calculator"], function ($, Calculator) {
    const uuid = 1;
    const ID_CALENDAR = "calendar_body_" + uuid;
    const CLASS_ROW = "row-" + uuid;

    const MODE_MONTH = "month";
    const MODE_WEEK = "week";

    function Calendar(opts) {
        this.params = {
            id: undefined,
            mode: MODE_MONTH,
            outMonthClickable: true,
            outMonthShowable: true,
            mondayToSunday: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            firstOfWeek: "",
            firstOfWeekIndex: 0,
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
        this.elMatrix = [];

        //构建html
        $("#" + this.params.id).html(calendarHtml());
        //初始化
        init(this);
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

    function init(calendar) {
        //添加每格子的监听，以及获取el的矩阵
        for (let i = 0; i < 6; i++) {
            let row = [];
            for (let j = 0; j < 7; j++) {
                let $el = $("#" + ID_CALENDAR).find(
                    `>.${CLASS_ROW}:nth(${i})>span:nth(${j})`
                );
                row.push($el);
                $el.on("click", event => {
                    let date = calendar.calculator.getMonthMatrix()[i][j];
                    let isCanClick = (
                        (
                            calendar.params.mode === MODE_MONTH
                            &&
                            (
                                (
                                    calendar.params.outMonthShowable && calendar.params.outMonthClickable
                                )
                                ||
                                (
                                    date.getMonth() === calendar.params.seedDate.getMonth()
                                    &&
                                    date.getFullYear() === calendar.params.seedDate.getFullYear()
                                )
                            )
                        ) || calendar.params.mode === MODE_WEEK);
                    if (isCanClick && calendar.onDateSelectedListeners) {
                        calendar.onDateSelectedListeners.forEach(listener => {
                            listener &&
                                listener(new Date(date), new Date(calendar.params.selectDate));
                        });
                        calendar.params.selectDate = date;
                    }
                });
            }
            calendar.elMatrix.push(row);
        }
    }

    Calendar.prototype.setConfig = function (config) {
        this.config = config;

        return;
    };

    Calendar.prototype.setDrawItemListener = function (listener) {
        this.drawItemListener = listener;
        return this;
    };

    Calendar.prototype.addOnMonthChangedListener = function (listener) {
        this.onMonthChangedListeners.push(listener);
        return this;
    };

    Calendar.prototype.addOnWeekChangedListener = function (listener) {
        this.onWeekChangedListeners.push(listener);
        return this;
    };

    Calendar.prototype.addOnDateSelectedListener = function (listener) {
        this.onDateSelectedListeners.push(listener);
        return this;
    };

    Calendar.prototype.addOnModeChangedListener = function (listener) {
        this.onModeChangedListeners.push(listener);
        return this;
    };

    Calendar.prototype.toggleMode = function (mode = undefined) {
        let lastMode = this.params.mode;
        if (!mode) {
            this.params.mode = (this.params.mode === MODE_WEEK ? MODE_MONTH : MODE_WEEK);
            this.params.mode === MODE_MONTH && expend(this);
            this.params.mode === MODE_WEEK && shrink(this);
        } else if (mode === MODE_WEEK) {
            this.params.mode = MODE_WEEK;
            shrink(this);
        } else if (mode === MODE_MONTH) {
            this.params.mode = MODE_MONTH;
            expend(this);
        }
        this.onModeChangedListeners && this.onModeChangedListeners.forEach(listener => {
            listener(this.params.mode, lastMode);
        });
    };

    function expend(calendar) {
        $(`#${ID_CALENDAR}`).find(`.${CLASS_ROW}`).slideDown(1000);
    }

    function shrink(calendar) {
        let row = getRowByDate(calendar.calculator.getMonthMatrix,calendar.params.selectDate);
        $(`#${ID_CALENDAR}`).find(`.${CLASS_ROW}`).not(`:nth(${row})`).slideDown(1000);
    }

    function getRowByDate(monthMatrix, date) {
        let row = 0;
        if (!date || !(date instanceof Date)) {
            return row;
        }
        for (let i = 0; i < monthMatrix.length; i++) {
            for (let j = 0; j < monthMatrix[i].length; j++) {
                let item = monthMatrix[i][j];
                if ((item.getDate() !== date.getDate()) || (item.getMonth() !== date.getMonth()) || (item.getFullYear() !== date.getFullYear())) {
                    continue;
                } else {
                    row = i;
                    break;
                }
            }
        }
        return row;
    }

    Calendar.prototype.getElementByDate = function (date) {
        let rs = this.calculator.getMonthMatrix().flat().map((day, index) => {
            return {
                date: day,
                index: index
            }
        }).filter(ele => {
            let day = ele.date;
            return day.getDate() === date.getDate()
                && day.getMonth() === date.getMonth()
                && day.getFullYear() === date.getFullYear();
        });
        if (rs && rs.length > 0) {
            let index = rs[0]["index"];
            return this.elMatrix[parseInt(index / 7)][index % 7];
        } else {
            return undefined;
        }

    }

    Calendar.prototype.nextMonth = function () {
        switchMonth(this, "nextMonth");
    };

    Calendar.prototype.lastMonth = function () {
        switchMonth(this, "lastMonth");
    };

    function switchMonth(calendar, functionName) {
        let lastMonthSeed = new Date(calendar.params.seedDate);
        calendar.calculator[functionName]();
        calendar.show(calendar.calculator.getMonthMatrix());
        calendar.onMonthChangedListeners && calendar.onMonthChangedListeners.forEach(listener => {
            listener(calendar, new Date(calendar.calculator.getSeedDate()), lastMonthSeed);
        });
    }

    Calendar.prototype.nextWeek = function () {
        this.calculator.nextWeek();
        this.show(this.calculator.getMonthMatrix());
    };

    Calendar.prototype.lastWeek = function () {
        this.calculator.lastWeek();
        this.show(this.calculator.getMonthMatrix());
    };

    Calendar.prototype.show = function (monthMatrix = undefined) {
        let enterParamIsNull = !monthMatrix;
        if (!monthMatrix) {
            this.calculator
                .setStartWeek(this.params.firstOfWeekIndex)
                .setSeedDate(this.params.seedDate)
                .calculate();
            monthMatrix = this.calculator.getMonthMatrix();
        }
        //绘制 & 点击监听
        for (let i = 0; i < this.elMatrix.length; i++) {
            for (let j = 0; j < this.elMatrix[i].length; j++) {
                let $el = this.elMatrix[i][j];
                let date = monthMatrix[i][j];
                //绘制
                //月模式下，如果月面板可见 或 月面板不可见且seed和目标格子日期一致 则绘制
                let isNeedDrawItem = (
                    (
                        this.params.mode === MODE_MONTH
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
                    this.params.mode === MODE_WEEK
                );
                this.drawItemListener && this.drawItemListener($el, date);//绘制item
                !isNeedDrawItem && $el.html("");//不需要显示的把内容置空，多这一步是为了drawItemListener把样式设置上
            }
        }
        if (enterParamIsNull) {//无monthMatrix表示默认第一次绘制，需要触发change回调
            this.params.mode === MODE_MONTH && this.onMonthChangedListeners && this.onMonthChangedListeners.forEach(listener => {
                listener(this, new Date(this.calculator.getSeedDate()), new Date(this.calculator.getSeedDate()));
            });
            this.params.mode === MODE_WEEK && this.onWeekChangedListeners && this.onWeekChangedListeners.forEach(listener => {
                listener(this);
            });
            this.params.selectDate && this.onDateSelectedListeners && this.onDateSelectedListeners.forEach(listener => {
                listener(this.params.selectDate, this.params.selectDate);
            });
        }
    };

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
            .setDrawItem(function (el, date) { })
            .addOnMonthChangedListener(function (
                calendarMatrix,
                currentSeed,
                lastSeed
            ) {
                //重刷标题
                //重刷日历面板
                //业务逻辑：获取数据，将获取结果
                request(month).then(res => {
                    if (requestDate === calendarMatrix.date) {
                        res.data.each(date => {
                            $(calendarMatrix.getElementByDate(date))
                                .find(".day")
                                .html("<div>有消息</div>");
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
                request().then(res => {
                    if (requestDate === calendar.params.selectDate) {
                        //处理逻辑
                    }
                });
            })
            .addOnModeChangedListener(function (isMonth) { })
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
            .setMondayToSunday([
                "周一",
                "周二",
                "周三",
                "周四",
                "周五",
                "周六",
                "周日"
            ])
            .setFirstOfWeek("周一") //与下2选1
            .setFirstOfWeekIndex(0) //与上2选1
            .addOnDateRangeChangedListener(function (calendarMatrix) {
                //计算

                //重刷标题

                //重刷日历面板

                //业务逻辑：获取数据，将获取结果
                //月模式
                cache
                    ? cache
                    : requestCalendar().then(res => {
                        if (requestDate === calendarMatrix.date) {
                            //请求日期等于日历当前展示
                            res.data.each(date => {
                                $(calendarMatrix.getElementByDate(date))
                                    .find(".day")
                                    .html("<div>有消息</div>");
                            });
                        }
                    });
                //周模式
                cache
                    ? cache
                    : requestCalendar().then(res => {
                        if (requestDate === calendarMatrix.date) {
                            //请求日期等于日历当前展示
                            res.data.each(date => {
                                $(calendarMatrix.getElementByDate(date))
                                    .find(".day")
                                    .html("<div>有消息</div>");
                            });
                        }
                    });
            })
            .addOnWeekChangedListener(function () { })
            .addOnMonthChangeListener(function (
                calendarMatrix,
                currentSeedDate,
                lastSeedDate
            ) {
                //计算
                //重刷标题
                //重刷日历面板
                //更新选中状态
                //业务逻辑：获取数据，将获取结果
            })
            .addOnDateSelectedListener(function (
                calendarMatrix,
                currentDate,
                lastDate
            ) {
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

            .addWeekBarAction(id, function () { })
            .removeWeekBarAction(id)

            .setCalendar(id, function (calendarMatrix) { })
            .show();
    }

    return Calendar;
});
