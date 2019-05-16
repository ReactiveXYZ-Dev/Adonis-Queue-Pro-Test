'use strict'

const { test } = use('Test/Suite')('Adonis Queue Pro Tests')
const { fork } = require('child_process');
const Helpers = use('Helpers');
const Queue = use('Queue');
const { SyncJob, AsyncJob, JobWithErrors, JobWithEvents, ScheduledJob  } = use('App/Jobs/Producers');

function startQueueServer() {
    const q = fork(Helpers.appRoot() + "/queue_server.js", [], {
      silent: true
    });
    q.stdout.on('data', m => console.log("From queue server: ", m.toString('utf8')));
    q.stderr.on('data', m => console.error("From queue server: ", m.toString('utf8')));
    process.on('exit', () => {
      q.kill();
    });
}

startQueueServer();

// run tests
test('run asynchronous job', async ({ assert }) => {
  const job = new AsyncJob({ 'testInput': 200 });
  Queue.dispatch(job);

  const res = await new Promise(resolve => {
    job.on('complete', res => resolve(res));
  });

  assert.equal(res, 250 + 200);
  
}).timeout(0);

test('run synchronous job', async ({ assert }) => {
  const job = new SyncJob({ 'testInput': 200 });
  Queue.dispatch(job);

  const res = await new Promise(resolve => {
    job.on('complete', res => resolve(res));
  });

  assert.equal(res, 55 + 200);
}).timeout(0);

test('run job with errors', async ({ assert }) => {
  const job = new JobWithErrors({ 'testInput': 200 });
  Queue.dispatch(job);

  const res = await new Promise(resolve => {
    job.on('failed', e => resolve(e));
  });
  assert.equal(res, "Failed to process job JobWithErrors! (src err: TEST ERROR)");
}).timeout(0);

test('run and remove job with a schedule', async ({ assert }) => {
  // schedule job in the future
  let job;
  job = new SyncJob({ 'testInput': 200 });
  Queue.dispatch(job, '2 seconds from now');

  const startTime = new Date();

  const res = await new Promise(resolve => {
    job.on('complete', data => {
      const elapsed = new Date() - startTime;
      resolve({
        data, elapsed
      });
    });
  }); 

  assert.equal(res.data, 55 + 200);
  assert.isAbove(res.elapsed, 2000);

  // schedule repeated jobs
  console.log("About to Scheduling jobs...")
  job = new ScheduledJob({ 'testInput': 200 });
  Queue.dispatch(job, 'every 2 seconds');

  console.log("Scheduling jobs...")
  const jobId = await new Promise(resolve => job.on('init', jobId => { resolve(jobId); } ));
  let count = 3;
  await new Promise((resolve, reject) => {
    job.on('complete', res => {
      assert.equal(res, 55 + 200);
      count -= 1;
      if (count == 0) {
        // remove job
        console.log("Removing job id ", jobId);
        Queue.remove(job).then(
          resolve,
          err => {
            console.error("Cannot remove", err);
            reject(err);
          }
        );
      }
    });
  });
  console.log("Jobs should be removed, checking further signals...")
  // make sure no more job completions are called
  await new Promise(resolve => {
    setTimeout(resolve, 5000);
  });

  assert.equal(count, 0);

}).timeout(0);

