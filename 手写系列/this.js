Function.prototype.call = function (thisArg, ...args) {
    if (thisArg === undefined || thisArg === null) {
        thisArg = window;
    } else {
        thisArg = Object(thisArg);
    }

    const name = Symbol();
    thisArg[name] = this;
    const res = thisArg[name](...args);
    delete thisArg[name];
    return res;
};
Function.prototype.apply = function (thisArg, args) {
    if (thisArg === undefined || thisArg === null) {
        thisArg = window;
    } else {
        thisArg = Object(thisArg);
    }

    const name = Symbol();
    thisArg[name] = this;
    const res = thisArg[name](...args);
    delete thisArg[name];
    return res;
};

Function.prototype.bind = function (thisArg, ...outerArgs) {
    const func = this;

    return function (...innerArgs) {
        func.call(thisArg, ...outerArgs, ...innerArgs);
    };
};

function new2(func) {
    const obj = Object.create(func.prototype);
    const res = func.call(obj);

    if (typeof res === "object" && res !== null) {
        return res;
    } else {
        return obj;
    }
}
