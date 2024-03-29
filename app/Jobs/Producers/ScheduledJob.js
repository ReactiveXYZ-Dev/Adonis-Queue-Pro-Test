'use strict';

const EventEmitter = require('events');

/**
 * Sample job producer class
 *
 * @version 2.0.0
 * @adonis-version 4.0+
 */

class ScheduledJob extends EventEmitter {

    /**
     * UUID for this job class
     * Make sure consumer and producer are in sync
     * @return {String}
     */
    static get type() {
        return 'scheduled-job';
    }

    /**
     * Inject custom payload into the job class
     * @param  {Object} data
     *
     * DO NOT MODIFY!
     */
    constructor(data) {
        super();
        this.data = data;
    }

    /**
     * Priority for this job
     * @return {String|Int}
     */
    get priority() {
        return 'normal';
    }

    /**
     * Number of attempts after each failure
     * @return {Int}
     */
    get attempts() {
        return 3;
    }

    /**
     * Whether this job will be unique
     * @return {Boolean}
     */
    get unique() {
        return true;
    }

    /**
     * Event handlers
     */
    /**
     * Job created and sent to queue
     * @param  {Kue/Job} job Kue job, see https://github.com/Automattic/kue/blob/master/lib/queue/job.js
     * @return {Void}
     */
    onInit(job) {
        console.log("Inited Job ID " + job.id);

        this.emit('init', job.id); // return the id of the kue job 
    }

    /**
     * Completed with optional data
     * @param  {Object} data Data passed from consumer's handle() method
     * @return {Void}
     */
    onComplete(data) {
        console.log("Completed!");

        this.emit('complete', data); // return the completion data
    }

    /**
     * Failed event
     * @param  {Error} e Error created from the consumer's handle() method
     * @return {Void}
     */
    onFail(e) {
        console.log(e.message);
    }

}

module.exports = ScheduledJob;
