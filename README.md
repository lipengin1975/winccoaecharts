# Chartcurve
## Overview
Chartcurve is a simple project for a trend webpage which is displayed in the webviewer ewo of WinCC OA.  
It's built with ECharts.js in a VUE 2.0 project and you can deploy it on the WINCCOA_PROJECTDIR/data/chartcurve directory. If you want to change the deploy directory please modify the publicPath in vue.config.js file before execute "npm run build" in your terminal.
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
cp -R PROJECTDIR/dist/* WINCCOA_PROJECTDIR/data/chartcurve
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Using in WinCC OA
Place a webview ewo on a panel, modify "Initialize" event function:
```c++
main()
{
  this.loadSnippet("/data/chartcurve/index.html");
}
```
Add the follow code in the "ScopLib" of the panel
```c++
/**
  * 拼装历史数据
  * @param {dyn_string} names 曲线名字
  * @param {dyn_string} tagNames 变量名称
  * @param {time} startTime 启示时间
  * @param {unsigned} spanSecond 时间轴长度(以秒为单位)
  * @param {unsigned} num 时间段分割数量
  * @return {dyn_mapping} 按格式拼装的历史数据
  */
dyn_mapping getSeriesesByTime(time startTime, unsigned spanSecond, unsigned num, dyn_mapping options)
{
  dyn_mapping serieses;
  dyn_string tagNames;
  dyn_time times = splitTimes(startTime, spanSecond, num); // 等分时间段

  // 创建序列
  for (int i = 1; i <= dynlen(options); i++)
  {
    mapping series;
    dyn_dyn_anytype data; // [[time1, value1], [time2, value2], ...]
    series["name"] = options[i]["name"];
    series["type"] = options[i]["type"];
    series["smooth"] = options[i]["smooth"];
    series["areaStyle"] = options[i]["areaStyle"];
    series["data"] = data;
    dynAppend(tagNames, options[i]["tagName"]);
    dynAppend(serieses, series);
  }

  for (int i = 1; i <= dynlen(times); i++)
  {
    mapping series;
    int ret = getHistoryValues(times[i], times[i], tagNames, series);
    for(int j = 1; j <= dynlen(tagNames); j++)
    {
      dynAppend(serieses[j]["data"], makeDynAnytype(times[i], series[tagNames[j]]));
    }
  }
  return serieses;
}

/**
  * @brief 等分时间段
  * @param {time} startTime 起始时间
  * @param {unsigned} spanSecond 时间长度(秒)
  * @param {unsigned} num 分割数量
  * @return {dyn_time} 被等分的时间点数组(返回的时间点数量通常是num+[1-2])
  */
dyn_time splitTimes(time startTime, unsigned spanSecond, unsigned num)
{
  dyn_time times;
  int interval = spanSecond / num;
  time t;
  time endTime = startTime + setPeriod( t, spanSecond); // 结束时间
  for (int i = 0; i < num; i++)
  {
    time t = startTime + setPeriod(t, interval * i);
    if (t < endTime)
      dynAppend(times, t);
    else
      break;
  }
  dynAppend(times, endTime);
  return times;
}

/**
  * @brief 获取不定数量变量的历史值
  * @param {time} [in] t1 起始时间
  * @param {time} [in] t2 结束时间
  * @param {dyn_string} [in] tagNames 变量名称数组
  * @param {mapping} [out] result 所有变量在起始时间之前的值
  * @return 调用结果, 0成功/-1失败
  */
int getHistoryValues(time t1, time t2, dyn_string tagNames, mapping &result)
{
  string script = "mapping main(time begin, time end) {mapping result;";
  int num = dynlen(tagNames);
  for (int i = 1; i <= num; i++)
  {
    script += "dyn_anytype val" + i + ";dyn_time t" + i + ";";
  }
  script += "dpGetPeriod(begin, end ,1 ,";
  for (int i = 1; i <= num; i++)
  {
    script += "\"" + tagNames[i] + "\"" + ",val" + i +",t" + i;
    if (i < num)
      script += ",";
    else
      script += ");";
  }
  for (int i = 1; i <= num; i++)
  {
    script += "if (dynlen(t" + i + ") > 0)" +
              "result[\"" + tagNames[i] + "\"] = val" + i + "[1];" +
              "else result[\"" + tagNames[i] + "\"] = NULL;";
  }
  script += "return result;}";

  int ret = evalScript(result, script,makeDynString(), t1, t2);

  return ret;
}

/**
  * @brief 创建单序列选项
  * @param {string} tagName PVSS变量名
  * @param {string} name 曲线名称
  * @param {string} type 曲线类型[line|bar]
  * @param {bool} smooth 平滑
  * @param {bool} areaStyle 绘制面积
  * @return 单序列选项
  */
mapping makeSeriesOption(string tagName, string name, string type, bool smooth = true, bool areaStyle = true)
{
  mapping option;
  option["tagName"] = tagName;
  option["name"] = name;
  option["type"] = type;
  option["smooth"] = smooth;
  option["areaStyle"] = areaStyle;

  return option;
}
```
In Extended event function named "messageReceive" of the webview ewo, add such code:
```c++
messageReceived(mapping params)
{
  if (params.params == "HtmlLoaded")
  {
    dyn_mapping options = makeDynMapping();
    time begin = makeTime(2020, 2, 22, 6, 0, 0);
    int num = 60;
    unsigned spanSecond = 60 * num;
  
    dynAppend(options, makeSeriesOption("DPE_NAME1", "1#", "line", true, true));
    dynAppend(options, makeSeriesOption("DPE_NAME2", "2#", "bar", true, true));
    dynAppend(options, makeSeriesOption("DPE_NAME3", "3#", "line", true, true));
    dynAppend(options, makeSeriesOption("DPE_NAME4", "4#", "bar", true, true));
    dynAppend(options, makeSeriesOption("DPE_NAME5", "5#", "line", true, true));
    
    dyn_mapping m = getSeriesesByTime(begin, spanSecond, num, options);
    
    mapping option;
    option["title"] = "Curves Compare";
    option["dataZoom"] = true;
    option["toolbox"] = true;
    option["series"] = m;
    //   WebView_ewo1.execJsFunction("setData", option); // same effect as next line
    this.msgToJs(params, option);
  }
}
```