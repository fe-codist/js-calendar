define(["jquery"], function ($, Calculator) {
    function Calendar(){

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

});