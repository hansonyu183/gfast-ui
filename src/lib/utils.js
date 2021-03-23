export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

export function toDay() {
    let n = new Date()
    return this.formatDate(n, 'yyyyMMdd')
}

export function CurrentMonthFirstDay() {
    let n = new Date()
    n.setDate(1)
    return this.formatDate(n, 'yyyyMMdd')
}

export function getDateByStr(str) {
    const year = str.substr(0, 4)
    const month = str.substr(4, 2)
    const day = str.substr(6, 2)
    let myDate = new Date();
    myDate.setFullYear(year, month, day);
    return myDate
}

export function addDate(dateStr, days) {
    let date = getDateByStr(dateStr);

    date.setDate(date.getDate() + days);

    let m = date.getMonth() ;
    let d = date.getDate()
    if (m < 10) {
        m = '0' + m
    }
    if (d < 10) {
        d = '0' + d
    }

    return date.getFullYear() + m + d;
}

export function deepTrimNull(obj) {
    for (const t in obj) {
        const tp = Object.prototype.toString.call(obj[t])
        if (tp === '[object Array]') {
            if (tp.length === 0) {
                obj[t] = undefined
            } else {
                deepTrimNull(obj[t]);
            }
        } else if (tp === '[object Object]') {
            deepTrimNull(obj[t]);
        } else if (tp === '[object Null]') {
            delete obj[t]
        }
    }
}

