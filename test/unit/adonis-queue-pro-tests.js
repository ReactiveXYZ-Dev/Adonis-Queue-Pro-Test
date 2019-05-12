'use strict'

const { test } = use('Test/Suite')('Adonis Queu Pro Tests')
const { fork } = require('child_process');
const Helpers = use('Helpers');

function startQueueServer() {
    console.log("Starting testing queue server");
    fork(Helpers.appRoot() + "/queue_server.js", [], {
      silent: true
    });
}

startQueueServer();

// run tests
test('run synchronous job', async ({ assert }) => {
  // TODO
});

test('run asynchronous job', async ({ assert }) => {
  // TODO
});

test('run and remove job with a schedule', async ({ assert }) => {
  // TODO
});

test('job event listeners', async ({ assert }) => {
  // TODO
});

test('run job with errors', async ({ assert }) => {
  // TODO
});

