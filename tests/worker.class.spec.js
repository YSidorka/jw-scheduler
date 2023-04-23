const JobWorker = require('../modules/worker-module/worker.class');
const { sleep } = require('../common/utils');

const jobWorkerMockup = {
  id: null,
  title: '',
  active: false,
  status: JobWorker.STATUS_NEW,
  started: null,
  finished: null,
  env: {},
  workerPath: null,
  worker: null,
  timeout: 0,
  log: []
};

const VALID_MOCK = {
  id: 'test-id',
  title: 'Test title',
  env: { processingTime: 500 },
  path: 'test-worker.js',
  timeout: 1000
};

test(`#0 Is valid class`, () => {
  expect(typeof JobWorker).toEqual('function');
  expect(JobWorker.STATUS_NEW).toEqual('NEW');
  expect(JobWorker.STATUS_PROCESS).toEqual('IN PROCESS');
  expect(JobWorker.STATUS_TERM).toEqual('TERMINATED');
});

test(`#1 Simple valid worker`, () => {
  const jobWorker = new JobWorker(VALID_MOCK);

  // mock data
  const _mock = Object.assign({}, jobWorkerMockup);
  _mock.id = VALID_MOCK.id;
  _mock.title = VALID_MOCK.title;
  _mock.env = VALID_MOCK.env;
  _mock.workerPath = VALID_MOCK.path;
  _mock.timeout = VALID_MOCK.timeout;

  expect(jobWorker).toEqual(_mock);
  expect(typeof jobWorker.env).toEqual('object');
});

test(`#2 Null to constructor`, () => {
  const jobWorker = new JobWorker(null);
  expect(jobWorker).toEqual(jobWorkerMockup);
});

test(`#3 Undefined to constructor`, () => {
  const jobWorker = new JobWorker();
  expect(jobWorker).toEqual(jobWorkerMockup);
});

test(`#4 Set boolean param to constructor`, () => {
  let jobWorker;

  jobWorker = new JobWorker(false);
  expect(jobWorker).toEqual(jobWorkerMockup);

  jobWorker = new JobWorker(true);
  expect(jobWorker).toEqual(jobWorkerMockup);
});

test(`#5 Set number as a param to constructor`, () => {
  let jobWorker;

  jobWorker = new JobWorker(0);
  expect(jobWorker).toEqual(jobWorkerMockup);

  jobWorker = new JobWorker(1);
  expect(jobWorker).toEqual(jobWorkerMockup);
});

test(`#6 Start process`, async () => {
  const jobWorker = new JobWorker(VALID_MOCK);
  const date = Date.now();

  // start process
  const result = await jobWorker.start();
  expect(result).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_PROCESS);
  expect(jobWorker.started).toBeGreaterThanOrEqual(date);
  expect(jobWorker.finished).toBeNull();
});

test(`#6-1 Double start process`, async () => {
  const jobWorker = new JobWorker(VALID_MOCK);
  let result;

  // first start process
  result = await jobWorker.start();
  expect(result).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_PROCESS);

  // second start process
  const date = Date.now();
  result = await jobWorker.start();
  expect(result instanceof Error).toBe(true);
  expect(jobWorker.started).toBeLessThanOrEqual(date);
});

test(`#7 Terminate started process`, async () => {
  const jobWorker = new JobWorker(VALID_MOCK);
  let result;

  // start process
  const date = Date.now();
  result = await jobWorker.start();
  expect(result).toBe(true);

  // terminate process
  await sleep(100);
  result = await jobWorker.terminate();

  expect(result).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_TERM);
  expect(jobWorker.started).toBeLessThanOrEqual(jobWorker.finished);
  expect(jobWorker.finished).toBeGreaterThanOrEqual(date);
});

test(`#7-1 Terminate NOT started process`, async () => {
  const jobWorker = new JobWorker(VALID_MOCK);
  let result;

  // terminate process
  result = await jobWorker.terminate();

  expect(result instanceof Error).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_NEW);
  expect(jobWorker.started).toBeNull();
  expect(jobWorker.finished).toBeNull();
});

test(`#7-2 Terminate already terminated process`, async () => {
  const jobWorker = new JobWorker(VALID_MOCK);
  let result;

  // start process
  result = await jobWorker.start();
  expect(result).toBe(true);

  // terminate process
  await sleep(100);
  result = await jobWorker.terminate();
  expect(result).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_TERM);

  // second termination process
  result = await jobWorker.terminate();
  expect(result instanceof Error).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_TERM);
});

test(`#8 Wait processing time`, async () => {
  const _timeout = VALID_MOCK.timeout;
  VALID_MOCK.timeout = 0;

  const jobWorker = new JobWorker(VALID_MOCK);
  let result;

  // return default timeout value
  VALID_MOCK.timeout = _timeout;

  // start process
  result = await jobWorker.start();
  expect(result).toBe(true);

  // wait processing time
  await sleep(jobWorker.env.processingTime + 100);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_FINISH);
});

test(`#9 Wait termination by timeout + terminate after`, async () => {
  const _timeout = VALID_MOCK.timeout;
  VALID_MOCK.timeout = 0.1; // 0.1 second

  const jobWorker = new JobWorker(VALID_MOCK);
  let result;

  // return default timeout value
  VALID_MOCK.timeout = _timeout;

  // start process
  result = await jobWorker.start();
  expect(result).toBe(true);

  // wait timeout
  await sleep(1000); // 1 second
  expect(jobWorker.status).toEqual(JobWorker.STATUS_TERM);

  // terminate process
  result = await jobWorker.terminate();
  expect(result instanceof Error).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_TERM);
});

test(`#10 Start -> Terminate -> Start`, async () => {
  const jobWorker = new JobWorker(VALID_MOCK);
  let result;

  // start process
  const date = Date.now();
  result = await jobWorker.start();
  expect(result).toBe(true);

  // terminate process
  await sleep(100);
  result = await jobWorker.terminate();
  expect(result).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_TERM);

  // start process
  const date_2 = Date.now();
  result = await jobWorker.start();

  expect(result).toBe(true);
  expect(jobWorker.status).toEqual(JobWorker.STATUS_PROCESS);
  expect(jobWorker.started).toBeGreaterThanOrEqual(date_2);
  expect(jobWorker.finished).toBeNull();
});
