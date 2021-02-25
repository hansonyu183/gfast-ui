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
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

export function toDay() {
    let n = new Date()
    return this.formatDate(n, 'yyyyMMdd')
}

export function CurrentMonthFirstDay() {
    let n = new Date()
    n.setDate(1)
    return this.formatDate(n, 'yyyyMMdd')
}

export function getPY(s) {
    if (s != '') {
        execScript('tmp=asc("' + s + '")', 'vbscript')
        tmp = 65536 + tmp

        var py = ''
        if (tmp >= 45217 && tmp <= 45252) {
            py = 'A'
        } else if (tmp >= 45253 && tmp <= 45760) {
            py = 'B'
        } else if (tmp >= 45761 && tmp <= 46317) {
            py = 'C'
        } else if (tmp >= 46318 && tmp <= 46825) {
            py = 'D'
        } else if (tmp >= 46826 && tmp <= 47009) {
            py = 'E'
        } else if (tmp >= 47010 && tmp <= 47296) {
            py = 'F'
        } else if ((tmp >= 47297 && tmp <= 47613) || (tmp == 63193)) {
            py = 'G'
        } else if (tmp >= 47614 && tmp <= 48118) {
            py = 'H'
        } else if (tmp >= 48119 && tmp <= 49061) {
            py = 'J'
        } else if (tmp >= 49062 && tmp <= 49323) {
            py = 'K'
        } else if (tmp >= 49324 && tmp <= 49895) {
            py = 'L'
        } else if (tmp >= 49896 && tmp <= 50370) {
            py = 'M'
        } else if (tmp >= 50371 && tmp <= 50613) {
            py = 'N'
        } else if (tmp >= 50614 && tmp <= 50621) {
            py = 'O'
        } else if (tmp >= 50622 && tmp <= 50905) {
            py = 'P'
        } else if (tmp >= 50906 && tmp <= 51386) {
            py = 'Q'
        } else if (tmp >= 51387 && tmp <= 51445) {
            py = 'R'
        } else if (tmp >= 51446 && tmp <= 52217) {
            py = 'S'
        } else if (tmp >= 52218 && tmp <= 52697) {
            py = 'T'
        } else if (tmp >= 52698 && tmp <= 52979) {
            py = 'W'
        } else if (tmp >= 52980 && tmp <= 53688) {
            py = 'X'
        } else if (tmp >= 53689 && tmp <= 54480) {
            py = 'Y'
        } else if (tmp >= 54481 && tmp <= 62289) {
            py = 'Z'
        } else {
            py = s.charAt(0)
        }
        return py
    }
}
