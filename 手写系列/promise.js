const State = {
    pending: Symbol("pending"),
    fulfilled: Symbol("fulfilled"),
    rejected: Symbol("rejected"),
};

class Promise2 {
    // Class function
    static all(promiseArray) {
        return new Promise2((resolve, reject) => {
            const result = [];

            promiseArray.forEach((promise) => {
                promise.then(
                    (res) => {
                        result.push(res);

                        if (result.length === promiseArray.length) {
                            reject(result);
                        }
                    },
                    (err) => {
                        reject(err);
                    }
                );
            });

            // promises.forEach(promise => })
        });
    }
    static allSettled(promiseArray) {
        return new Promise2((resolve) => {
            const result = [];
            let settledCount = 0;

            promiseArray.forEach((promise, index) => {
                promise
                    .then(
                        (res) => {
                            result[index] = {
                                status: State.fulfilled,
                                value: res,
                            };
                        },
                        (err) => {
                            result[index] = {
                                status: State.rejected,
                                reason: err,
                            };
                        }
                    )
                    .then(() => {
                        settledCount++;
                        if (settledCount === promiseArray.length) {
                            resolve(result);
                        }
                    });
            });
        });
    }
    static any(promiseArray) {
        return new Promise2((resolve, reject) => {
            let rejectedCount = 0;
            const errors = new AggregateError();

            promiseArray.forEach((promise) => {
                promise.then(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        errors.push(err);

                        if (rejectedCount === promiseArray.length) {
                            reject(errors);
                        }
                    }
                );
            });
        });
    }
    static race(promiseArray) {
        return new Promise2((resolve, reject) => {
            promiseArray.forEach((promise) => promise.then(resolve, reject));
        });
    }
    static resolve(res) {
        if (typeof res === "object" && res !== null) {
            if (res instanceof Promise2) {
                return res;
            } else if (typeof res.then === "function") {
                return new Promise2((...args) => res.then(...args));
            }
        }

        return new Promise2((resolve) => resolve(res));
    }
    static reject(reason) {
        return new Promise2((resolve, reject) => {
            reject(reason);
        });
    }

    queue = [];
    state = State.pending; // pending, fulfilled, rejected
    result = undefined;

    constructor(resolver) {
        const resolve = (res) => {
            if (this.state === State.pending) {
                this.state = State.fulfilled;
                this.result = res;
                this.then();
            }
        };

        const reject = (err) => {
            if (this.state === State.pending) {
                this.state = State.rejected;
                this.result = err;
                this.then();
            }
        };

        if (typeof resolver !== "function") {
            throw TypeError(`Promise resolver ${resolver} is not a function`);
        }

        try {
            resolver(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        return new Promise2((resolve, reject) => {
            // 依赖收集：所有依赖于上个 Promise 的方法全部加入 queue 中，等待后续操作
            this.queue.push([onFulfilled, onRejected, resolve, reject]);

            if (this.state === State.pending) {
                return;
            }

            // rejected 每次遍历完后，如果没有处理错误则需要抛出
            // if no onRejected handle is provided, the then method will report an error.
            /**
             * 1. 没有 then 处理错误，则直接报错
             * 2.
             */
            let flag = false;

            this.queue.forEach(([onFulfilled, onRejected, resolve, reject]) => {
                try {
                    let result;

                    if (this.state === State.fulfilled) {
                        if (typeof onFulfilled === "function") {
                            result = onFulfilled(this.result);
                        } else {
                            result = this.result;
                        }
                    } else if (this.state === State.rejected) {
                        if (typeof onRejected === "function") {
                            result = onRejected(this.result);
                            flag = true;
                        }
                    }

                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });

            this.queue = [];

            if (flag) {
                throw this.result;
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        return this.then(
            (res) =>
                Promise2.resolve(onFinally()).then(() => {
                    return res;
                }),
            (err) =>
                Promise2.resolve(onFinally()).then(() => {
                    throw err;
                })
        );
    }
}

// a = new Promise2((res) => res(1));
// a.then(console.log);
// a.catch(console.log);
// a.finally(console.log);

a = new Promise2((a, b) => setTimeout(b, 1000));
a.then(console.log);
a.catch(console.log);

// const promise = new Promise2((resolve, reject) => {
//     setTimeout(() => {
//         resolve("成功");
//     }, 1000);
// }).then(
//     (data) => {
//         console.log("success", data);
//     },
//     (err) => {
//         console.log("faild", err);
//     }
// );

// const tt = [];
// tt.push(new Promise2((a) => setTimeout(a, 1000)));
// tt.push(new Promise2((a, b) => setTimeout(b, 500)));
// tt.push(new Promise2((a) => a(20)));

// Promise2.allSettled(tt).then(console.log).catch(console.log);

/**
 * Promise:
 *  1. resolve
 *  2. reject or throw a error
 * then for reject:
 *  1. an error is reported if there is no onRejected function.
 *
 */
