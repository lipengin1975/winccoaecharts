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