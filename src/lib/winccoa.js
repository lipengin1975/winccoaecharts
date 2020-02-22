import * as EChartsOption from './echartsopt';

export function toCtrl(msg, callback) {
    if (typeof oaJsApi !== 'undefined') {
        // eslint-disable-next-line
        oaJsApi.toCtrl(msg, {
            success: data => {
                callback(data);
            },
            error: () => { console.log(arguments) }
        });
    } else {
        let option = EChartsOption.getOption();
        callback(option);
    }
}