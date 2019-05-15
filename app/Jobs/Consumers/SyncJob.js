'use strict';

const { testSync } = use("App/Utils");

/**
 * Sample job consumer class
 *
 * @version 2.0.0
 * @adonis-version 4.0+
 */

class SyncJob {

    /**
     * Concurrency for processing this job
     * @return {Int} Num of jobs processed at time
     */
    static get concurrency() {
        return 1;
    }

    /**
     * UUID for this job class
     * Make sure consumer and producer are in sync
     * @return {String}
     */
    static get type() {
        return 'sync-job';
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
     * Handle the sending of email data
     * You can remove the async keyword if it is synchronous
     */
    handle() {
        console.log("Handled sync jobs");
        return testSync() + this.data['testInput'];
    }


}

module.exports = SyncJob;
