define(["jquery", "./calculator"], function ($, Calculator) {
    const uuid = 1;
    const ID_CALENDAR = "calendar_body_" + uuid;
    const CLASS_ROW = "row-" + uuid;

    const MODE_MONTH = "month";
    const MODE_WEEK = "week";

    function Calendar(opts) {
        this.params = {
            id: undefined,
            mode: MODE_WEEK,
            outMonthClickable: false,
            outMonthShowable: true,
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
                                    date.getMonth() === calendar.calculator.getSeedDate().getMonth()
                                    &&
                                    date.getFullYear() === calendar.calculator.getSeedDate().getFullYear()
                                )
                            )
                        ) || calendar.params.mode === MODE_WEEK);

                    if (isCanClick && calendar.onDateSelectedListeners) {
                        calendar.onDateSelectedListeners.forEach(listener => {
                            listener &&
                                listener(calendar, new Date(date), new Date(calendar.params.selectDate));
                        });
                        calendar.params.selectDate = new Date(date);
                        calendar.calculator.setSeedDate(new Date(date)).calculate();
                    }
                });
            }
            calendar.elMatrix.push(row);

            let drawTitle = function (calendar, seedDate) {
                calendar.drawTitleListener && calendar.drawTitleListener(calendar, seedDate);
            }
            calendar.onMonthChangedListeners.push(function (calendar, seedDate, lastSeedDate) {
                drawTitle(calendar, seedDate);
            });
            calendar.onWeekChangedListeners.push(function (calendar, seedDate, lastSeedDate) {
                drawTitle(calendar, seedDate);
            });
            calendar.onDateSelectedListeners.push(function (calendar, seedDate, lastDate) {
                drawTitle(calendar, seedDate);
            });
            calendar.onModeChangedListeners.push(function(mode,lastMode){
                if(mode===MODE_MONTH){
                    calendar.onMonthChangedListeners.forEach(listener=>{
                        listener(calendar,new Date(calendar.calculator.getSeedDate()),new Date(calendar.calculator.getSeedDate()));
                    });
                }else{
                    calendar.onWeekChangedListeners.forEach(listener=>{
                        listener(calendar,new Date(calendar.calculator.getSeedDate()),new Date(calendar.calculator.getSeedDate()));
                    });
                }
            });

            calendar.onModeChangedListeners.push(function(mode,lastMode){
                if(mode===MODE_MONTH){
                    
                }
            });
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

    Calendar.prototype.setDrawTitleListener = function (listener) {
        this.drawTitleListener = listener;
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

    Calendar.prototype.toggleMode = function (time = 1000, mode = undefined) {
        let lastMode = this.params.mode;
        if (!mode) {
            this.params.mode = (this.params.mode === MODE_WEEK ? MODE_MONTH : MODE_WEEK);
            this.params.mode === MODE_MONTH && expend(this, time);
            this.params.mode === MODE_WEEK && shrink(this, time);
        } else if (mode === MODE_WEEK) {
            this.params.mode = MODE_WEEK;
            shrink(this, time);
        } else if (mode === MODE_MONTH) {
            this.params.mode = MODE_MONTH;
            expend(this, time);
        }
        this.onModeChangedListeners && this.onModeChangedListeners.forEach(listener => {
            listener(this.params.mode, lastMode);
        });
    };

    function expend(calendar, time) {
        calendar.show(calendar.calculator.getMonthMatrix());
        $(`#${ID_CALENDAR}`).find(`.${CLASS_ROW}`).slideDown(time);
    }

    function shrink(calendar, time) {
        let row = getRowByDate(calendar.calculator.getMonthMatrix(), calendar.params.selectDate);
        calendar.calculator.setSeedDate(new Date(calendar.params.selectDate));
        calendar.show(calendar.calculator.getMonthMatrix());
        $(`#${ID_CALENDAR}`).find(`.${CLASS_ROW}`).not(`:nth(${row})`).slideUp(time);
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
        if (calendar.params.mode === MODE_WEEK) {
            return;
        }
        let lastMonthSeed = new Date(calendar.calculator.getSeedDate());
        calendar.calculator[functionName]();
        calendar.show(calendar.calculator.getMonthMatrix());
        calendar.onMonthChangedListeners && calendar.onMonthChangedListeners.forEach(listener => {
            listener(calendar, new Date(calendar.calculator.getSeedDate()), lastMonthSeed);
        });
    }

    Calendar.prototype.nextWeek = function () {
        switchWeek(this, "nextWeek");
    };

    Calendar.prototype.lastWeek = function () {
        switchWeek(this, "lastWeek");
    };

    function switchWeek(calendar, functionName) {
        if (calendar.params.mode === MODE_MONTH) {
            return;
        }
        let lastSeed = new Date(calendar.calculator.getSeedDate());
        calendar.calculator[functionName]();
        calendar.show(calendar.calculator.getMonthMatrix());
        //找到显示行
        let row = calendar.calculator.getMonthMatrix().indexOf(calendar.calculator.getWeekMatrix());
        //显示目标行
        $(`#${ID_CALENDAR}`).find(`.${CLASS_ROW}`).slideUp(0);
        $(`#${ID_CALENDAR}`).find(`.${CLASS_ROW}:nth(${row})`).slideDown(0);
        //隐藏其他行
        calendar.onWeekChangedListeners && calendar.onWeekChangedListeners.forEach(listener => {
            listener(calendar, new Date(calendar.calculator.getSeedDate()), lastSeed);
        });
    }

    Calendar.prototype.show = function (monthMatrix = undefined) {
        let enterParamIsNull = !monthMatrix;
        if (!monthMatrix) {
            this.calculator
                .setStartWeek(this.params.firstOfWeekIndex)
                .setSeedDate(new Date(this.params.seedDate))
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
                                date.getMonth() === this.calculator.getSeedDate().getMonth()
                                &&
                                date.getFullYear() === this.calculator.getSeedDate().getFullYear()
                            )
                        )
                    )
                    ||
                    this.params.mode === MODE_WEEK
                );
                this.drawItemListener && this.drawItemListener(this, $el, date);//绘制item
                !isNeedDrawItem && $el.html("");//不需要显示的把内容置空，多这一步是为了drawItemListener把样式设置上
            }
        }
        if (enterParamIsNull) {//无monthMatrix表示默认第一次绘制，需要触发change回调
            this.params.mode === MODE_MONTH && this.onMonthChangedListeners && this.onMonthChangedListeners.forEach(listener => {
                listener(this, new Date(this.calculator.getSeedDate()), new Date(this.calculator.getSeedDate()));
            });
            this.params.mode === MODE_WEEK && this.onWeekChangedListeners && this.onWeekChangedListeners.forEach(listener => {
                listener(this, new Date(this.calculator.getSeedDate()), new Date(this.calculator.getSeedDate()));
            });
            this.params.selectDate && this.onDateSelectedListeners && this.onDateSelectedListeners.forEach(listener => {
                listener(this, new Date(this.params.selectDate), new Date(this.params.selectDate));
            });
            this.toggleMode(0, this.params.mode);
        }
    };

    return Calendar;
});
