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
  assert.equal(res, "Failed to process job JobWithErrors! (err msg: TEST ERROR)");
}).timeout(0);

// test('run and remove job with a schedule', async ({ assert }) => {
//   // TODO
// });

// test('job event listeners', async ({ assert }) => {
//   // TODO
// });
