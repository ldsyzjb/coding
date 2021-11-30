/**
 * 防止 delay 时间内 func 的抖动触发
 * @param {Function} func
 * @param {Number} delay
 * @returns
 */
function debounce(func, delay, immediately) {
    let timer = null;

    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }

        if (immediately) {
            timer === null && func.apply(this, args);

            timer = setTimeout(() => {
                timer = null;
            }, delay);
        } else {
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        }
    };
}

/**
 * 在 delay 时间内只触发一次 func
 * @param {Function} func
 * @param {Number} delay
 * @returns
 */
function throttle(func, delay) {
    let flag;

    return function (...args) {
        const now = Date.getTime();

        if (now - delay > flag) {
            flag = now;
            func.apply(this, args);
        }
    };
}
