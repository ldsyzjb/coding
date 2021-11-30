function shallowCopy(source) {
    if (typeof source === "object" && source !== null) {
        if (Array.isArray(source)) {
            return [...source];
        }
    }
}

function deepCopy(source, map = new Map()) {
    // 循环嵌套对象
    if (map.has(source)) {
        return map.get(source);
    }

    // 基础类型 和 函数
    if (typeof source !== "object" || source === null) {
        return source;
    }

    // 日期 和 正则
    if ([Date, RegExp].includes(source.constructor)) {
        return new source.constructor(source);
    }

    // 其他对象
    const target = new source.constructor();
    map.set(source, target);

    if (source instanceof Map) {
        source.forEach((value, key) => target.set(key, deepCopy(value)));
    } else if (source instanceof Set) {
        source.forEach((value) => target.add(deepCopy(value)));
    } else {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = deepCopy(source[key], map);
            }
        }
    }

    // TODO: Proxy, Reflect,

    return target;
}
