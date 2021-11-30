function parallel(iterable, length, callback) {
    return new Promise(async (resolve) => {
        const iterator = iterable[Symbol.iterator]();
        const result = [];
        let count = 0; // 正在运行数
        let index = 0; // 运行总数
        let done = false;

        function run(ind, res) {
            result[ind] = res;

            if (done) {
                if (count === 0) {
                    resolve(result);
                }
            } else {
                while (count < length) {
                    const current = iterator.next();
                    const currentIndex = index;

                    function then(res) {
                        count--;
                        run(currentIndex, res);
                    }

                    callback(current.value, currentIndex).then(then, then);

                    done = current.done;
                    count++;
                    index++;
                }
            }
        }

        run();
    });
}

let ary = [];
for (let i = 0; i < 20; i++) ary[i] = i;
let func = (d) => new Promise((res) => setTimeout(() => res(d), 200));
parallel(ary, 3, func).then(console.log);
