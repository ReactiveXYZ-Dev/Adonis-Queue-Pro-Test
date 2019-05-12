/**
 * Just some dummy functions for testing purpose
 */
module.exports = {
    testAsync() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(250);
            }, 200);
        });
    },

    testSync() {
        let sum = 0;
        for (let i = 1; i <= 10; ++i) {
            sum += i;
        }
        return sum;
    }
};
