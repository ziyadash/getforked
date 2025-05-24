// to create & share one instance of Mutex & Semaphore
const {Mutex, Semaphore } = require('async-mutex');

export const writeMutex = new Mutex();
export const readSemaphore = new Semaphore(10); // allow 10 ppl to acess
