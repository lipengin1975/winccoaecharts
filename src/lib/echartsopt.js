"use strict";

import * as WinCCOA from '../lib/winccoa';

// 曲线数据
let data = [];
// 工具栏组件配置对象
const toolbox = {
    feature: {
        saveAsImage: {},
        magicType: {
            type: ['line', 'bar', 'stack', 'tiled']
        },
        dataView: { show: true, readOnly: false }
    }
};
// 缩放组建配置对象
const dataZoom = [
    {
        show: true,
        realtime: true,
        start: 0,
        end: 100
    },
    {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 10
    }
];
// 总配置对象
const option = {
    title: {
        text: 'curve',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {},
    xAxis: {
        type: 'time'
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'Var1',
            type: 'bar',
            smooth: true,
            areaStyle: true,
            data: data
        }
    ]
}

/**
 * 获取显示配置项
 * @param {object} data 显示配置项
 * @param {function} callback 回调函数
 */
export function getOption(data, callback) {
    if (typeof oaJsApi !== 'undefined') {
        if (data === undefined) { // 界面初始化时发送通知消息给WinCC OA
            WinCCOA.toCtrl('HtmlLoaded', params => {
                console.log(params);
                setOption(params);
                callback(option);
            });
            return;
        } else { // 由WinCC OA调用设置显示选项
            setOption(data, true);
        }
    } else { // 浏览器测试用
        getSampleData();
    }
    callback(option);
}

/**
 * 设置总显示配置
 * @param {object} data 显示参数
 * @param {bool} onlyData 是否只改变曲线数据
 */
function setOption(data, onlyData = false) {
    // 标题文字
    if (data.title !== undefined) option.title.text = data.title;
    // 缩放组件
    if (data.dataZoom !== undefined && data.dataZoom === true) {
        option.dataZoom = dataZoom;
    } else if (!onlyData) {
        delete option.dataZoom;
    }
    // 工具栏
    if (data.toolbox !== undefined && data.toolbox === true) {
        option.toolbox = toolbox;
    } else if (!onlyData) {
        delete option.toolbox;
    }
    // 曲线数据
    if (data.series !== undefined) option.series = data.series;
}

/**
 * 用于浏览器测试用的模拟数据
 */
function getSampleData() {
    let startTime = new Date('2020-01-10 08:00:00');
    for (let i = 0; i < 10; i++) {
        let date = new Date(startTime);
        date.setMilliseconds(date.getMilliseconds() + 3600 * 1000 * i);
        data.push([date.toISOString(), Math.random() * 10.0]);
    }
}