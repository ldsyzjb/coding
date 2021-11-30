/**
 * 偏函数
 * @param {*} fn
 * @param  {...any} outerArgs
 * @returns
 */
function partial(fn, ...outerArgs) {
    return function () {
        return fn.call(this, ...outerArgs, ...arguments);
    };
}

/**
 * 柯里化函数
 * @param {*} func
 * @returns
 */
function curry(func) {
    return function wrap(...args) {
        if (func.length <= args.length) {
            return func.call(this, ...args);
        } else {
            return wrap.bind(this, ...args);
        }
    };
}

/**
 * 函数组合
 *  所有的函数都应该返回数组，以便后续函数使用
 * @returns
 */
function compose() {
    const funcList = Array.from(arguments);

    funcList.forEach((func) => {
        if (typeof func !== "function") {
            new TypeError(`Expect ${func} is a function`);
        }
    });

    return function () {
        return funcList.reduceRight((args, func) => {
            return func(...args);
        }, Array.from(arguments));
    };
}
