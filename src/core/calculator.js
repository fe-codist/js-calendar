define([
], function () {
    'use strict';
    function Calculator() {
        this.seedDate = new Date();
        this.startWeek = 6;
    }

    Calculator.prototype.setSeedDate = function (seedDate) {
        this.seedDate = seedDate;
        return this;
    }

    Calculator.prototype.getSeedDate = function (seedDate) {
        return this.seedDate;
    }

    Calculator.prototype.setStartWeek = function (startWeek) {
        this.startWeek = startWeek;
        return this;
    }

    Calculator.prototype.calculate = function () {
        this.monthMatrix = calcMonthMatrix(this.seedDate, this.startWeek);
        this.weekMatrix = calcWeekMatrix(this.seedDate, this.monthMatrix);
        return this;
    }

    Calculator.prototype.getMonthMatrix = function () {
        return this.monthMatrix;
    }

    Calculator.prototype.getWeekMatrix = function () {
        return this.weekMatrix;
    }

    return Calculator;


    /**
     * 给定一周的开始礼拜几，推算出任意列是礼拜几
     * @param {Number} column (0-6代表第一列到第七列)
     * @param {Number} weekStart (0-6代表周一到周日)
     */
    function getWeekday(column, weekStart) {
        return column - weekStart + (((column + weekStart) > 6) ? ((weekStart << 1) - 7) : (weekStart << 1))
    }


    /**
     * 
     * @param {Date} seedDate 做推算的种子日期
     * @param {Number} weekStart 
     */
    function calcMonthMatrix(seedDate, weekStart) {
        let monthMatrix = [];
        //1.通过seed算出当月第一天周几
        let firstDayOfMonth = new Date(seedDate.getFullYear(), seedDate.getMonth(), 1);
        //2.通过weekStart获取6*7矩阵中[0][0]位置的日期
        let firstDayColumn = [0, 1, 2, 3, 4, 5, 6]
            .map(column => {//推出每个格子对应周几
                return getWeekday(column, weekStart);
            })
            .map((ele, index) => {//为每一列绑定周几
                return { dayOfWeek: ele, column: index };
            })
            .filter(weekDay => {//获取当月一号是第几列
                return weekDay["dayOfWeek"] === (((firstDayOfMonth.getDay() || 7)) - 1);
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
                return seedDate instanceof Date
                    && seedDate.getDate() === date.getDate()
                    && seedDate.getMonth() === date.getMonth()
                    && seedDate.getFullYear() === date.getFullYear();
            });
        if (rs && rs.length > 0) {
            return monthMatrix[parseInt(rs[0]["index"] / 7)];
        } else {
            return [];
        }
    }

});