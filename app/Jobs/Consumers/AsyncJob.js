'use strict';

const { testAsync } = use("App/Utils");

/**
 * Sample job consumer class
 *
 * @version 2.0.0
 * @adonis-version 4.0+
 */

class AsyncJob {

    /**
     * Concurrency for processing this job
     * @return {Int} Num of jobs processed at time
     */
    static get concurrency() {
        return 1;
    }
    /**
     * Inject the kue ctx to the consumer, you can use it to
     * pause(), shutdown() or remove() handler actions.
     * See kue's doc for more details
     * @param  {Object} data
     *
     * DO NOT MODIFY!
     */
    setContext(ctx) {
      this.ctx = ctx;
    }

    /**
     * UUID for this job class
     * Make sure consumer and producer are in sync
     * @return {String}
     */
    static get type() {
        return 'async-job';
    }

    /**
     * Inject custom payload into the job class
     * @param  {Object} data
     *
     * DO NOT MODIFY!
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Handle the sending of email data
     * You can remove the async keyword if it is synchronous
     */
    async handle() {
        
        const res = await testAsync();
        return res + this.data['testInput'];
    }


}

module.exports = AsyncJob;
