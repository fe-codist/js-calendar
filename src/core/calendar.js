define(["jquery"], function ($, Calculator) {
    const UUID = 1;
    const ID_CALENDAR = "calendar_" + UUID;
    const CLASS_ROW = "row-" + UUID;
    const MODE_MONTH = "month";
    const MODE_WEEK = "week";

    function Calendar(opts) {
        this.elMatrix = [];
        this.monthMatrix = [];
        this.params = {
            id: undefined,
            mode: MODE_MONTH,
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
        this.onDrawItemListener = undefined;

        //初始化
        if (!this.params.id) {
            return;
        }

        this.init();
    }

    Calendar.prototype.init = function () {
        //初始化日期矩阵
        this.calculate()
        //初始化elhtml
        calendarHtml(this.params.id);
        $(`#${ID_CALENDAR}`).find(`.${CLASS_ROW}`).each((row, $row) => {
            let rows = [];
            $($row).find(">span").each((column, $el) => {
                rows.push($($el));
            });
            this.elMatrix.push(rows);
        });
        //添加监听
        addClickListener(this, this.onDateSelectedListeners);

    }

    Calendar.prototype.calculate = function () {
        this.monthMatrix = calcMonthMatrix(this.getSeedDate(), this.params.firstOfWeekIndex);
        return this;
    }

    Calendar.prototype.setDrawItemListener = function (listener) {
        this.onDrawItemListener = listener;
        return this;
    }

    Calendar.prototype.addOnDateSelectedListener = function (listener) {
        this.onDateSelectedListeners.push(listener);
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

    Calendar.prototype.show = function (monthMatrix) {
        draw(this, this.elMatrix, monthMatrix || this.monthMatrix, this.onDrawItemListener);
    }

    Calendar.prototype.getSeedDate = function () {
        return this.params.seedDate;
    }

    Calendar.prototype.getSelectDate = function () {
        return this.params.selectDate;
    }

    Calendar.prototype.isMonthMode = function () {
        return this.params.mode === MODE_MONTH;
    }

    Calendar.prototype.toggleMode = function () {
        this.params.mode === MODE_WEEK ? this.monthMode() : this.weekMode();
    }

    Calendar.prototype.weekMode = function () {
        this.params.mode = MODE_WEEK;
        //logic

    }

    Calendar.prototype.monthMode = function () {
        this.params.mode = MODE_MONTH;
        //logic
    }

    Calendar.prototype.nextMonth = function () {
        this.switchMonth(() => {
            this.params.seedDate.setMonth(this.params.seedDate.getMonth() + 1);
        });
    }

    Calendar.prototype.lastMonth = function () {
        this.switchMonth(() => {
            this.params.seedDate.setMonth(this.params.seedDate.getMonth() - 1);
        });
    }

    Calendar.prototype.switchMonth = function (calcuSeed) {
        //计算种子
        calcuSeed && calcuSeed();
        //计算矩阵
        this.calculate();
        //绘制图形
        this.draw();
        //回调监听
        this.onMonthChangedListeners.forEach(listener => {
            listener(this, new Date(this.params.seedDate));
        });
    }

    Calendar.prototype.nextWeek = function () {

    }

    Calendar.prototype.lastWeek = function () {

    }

    Calendar.prototype.getElementByDate = function (date) {
        let rs = this.monthMatrix.flat().map((day, index) => {
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

    Calendar.prototype.draw = function (monthMatrix) {
        draw(this, this.elMatrix, monthMatrix || this.monthMatrix, this.onDrawItemListener);
    }

    function calendarHtml(id) {
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
        $(`#${id}`).html(calendar);
    }

    function addClickListener(calendar, listeners) {
        calendar.elMatrix.forEach(($row, row) => {
            $row.forEach(($el, column) => {
                $el.on("click", function () {
                    let date = calendar.monthMatrix[row][column];
                    let isCanClick = (
                        (
                            calendar.isMonthMode()
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
                    if (isCanClick && listeners) {
                        listeners.forEach(listener => {
                            listener &&
                                listener(calendar, new Date(date), new Date(calendar.params.selectDate));
                        });
                        calendar.params.selectDate = new Date(date);
                        //重刷界面
                        calendar.show();
                    }
                });
            });
        });
    }

    function draw(calendar, elMatrix, monthMatrix, onDrawItemListener) {
        let opts = calendar.params;
        let seedDate = opts.seedDate;
        let isMonthMode = opts.mode === MODE_MONTH;
        let outMonthShowable = opts.outMonthShowable;
        elMatrix.forEach(($row, row) => {
            $row.forEach(($el, column) => {
                let date = monthMatrix[row][column];
                let isNeedDrawItem = (
                    (
                        isMonthMode
                        &&
                        (
                            outMonthShowable
                            ||
                            (
                                date.getMonth() === seedDate.getMonth()
                                &&
                                date.getFullYear() === seedDate.getFullYear()
                            )
                        )
                    )
                    ||
                    !isMonthMode
                );
                onDrawItemListener && onDrawItemListener(calendar, $el, date);
                !isNeedDrawItem && $el.html("");//不需要显示的把内容置空，多这一步是为了drawItemListener把样式设置上
            });
        });
    }

    /**
     * 给定一周的开始礼拜几，推算出任意列是礼拜几
     * @param {Number} column (0-6代表第一列到第七列)
     * @param {Number} weekStart (0-6代表周一到周日)
     */
    function getWeekday(column, weekStart) {
        return (
            column -
            weekStart +
            (column + weekStart > 6 ? (weekStart << 1) - 7 : weekStart << 1)
        );
    }

    /**
     *
     * @param {Date} seedDate 做推算的种子日期
     * @param {Number} weekStart
     */
    function calcMonthMatrix(seedDate, weekStart) {
        let monthMatrix = [];
        //1.通过seed算出当月第一天周几
        let firstDayOfMonth = new Date(
            seedDate.getFullYear(),
            seedDate.getMonth(),
            1
        );
        //2.通过weekStart获取6*7矩阵中[0][0]位置的日期
        let firstDayColumn = [0, 1, 2, 3, 4, 5, 6]
            .map(column => {
                //推出每个格子对应周几
                return getWeekday(column, weekStart);
            })
            .map((ele, index) => {
                //为每一列绑定周几
                return { dayOfWeek: ele, column: index };
            })
            .filter(weekDay => {
                //获取当月一号是第几列
                return weekDay["dayOfWeek"] === (firstDayOfMonth.getDay() || 7) - 1;
            })[0]["column"];

        //3.获取上个月面板[5][6]位置的日期
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayColumn - 1);
        //4.推算出6*7矩阵所有位置的日期
        for (let i = 0; i < 6; i++) {
            let dayRow = [];
            for (let j = 0; j < 7; j++) {
                firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
                dayRow.push(new Date(firstDayOfMonth));
            }
            monthMatrix.push(dayRow);
        }
        return monthMatrix;
    }

    function calcWeekMatrix(seedDate, monthMatrix) {
        let rs = monthMatrix
            .flat()
            .map((date, index) => {
                return {
                    date: date,
                    index: index
                };
            })
            .filter((ele, index) => {
                let date = ele["date"];
                return (
                    seedDate instanceof Date &&
                    seedDate.getDate() === date.getDate() &&
                    seedDate.getMonth() === date.getMonth() &&
                    seedDate.getFullYear() === date.getFullYear()
                );
            });
        if (rs && rs.length > 0) {
            return monthMatrix[parseInt(rs[0]["index"] / 7)];
        } else {
            return [];
        }
    }

    // 计算 绘制 
    //日历面板何时绘制？切换月，点击，周月模式切换 需要重新绘制
    //何时附加绘制？当切换月或周的时候，异步请求回数据，根据返回的数据往面板上追加显示信息

    //1.普通绘制流程
    //月模式：通过给定的初始seed，计算出当月date Matrix，对html el Matrix进行操作，
    // 操作分为绘制、添加事件(仅在第一次添加事件)
    // 绘制过程是回调drawItem函数，注意：需考虑6*7矩阵中非本月的日期如何绘制；如何绘制

    //由给定seed=>matrix

    //选中一个date时，重置seed=>matrix

    //切换月、周时，通过操作seed，再通过seed=>matrix


    //绘制流程：
    //月模式：seed=>matrix=>回调drawItem函数=>主动调用

    //周月切换流程：
    /**
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
     */
    return Calendar;
});