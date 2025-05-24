import { DataStore, Election, Session, SessionStore, User } from '../../../shared/interfaces';
import {generateUserId, generateSessionId, verifySessionId, getHashOf} from './dataUtil';
import { promises as fs, write } from 'fs';
// to create & share one instance of Mutex & Semaphore
const {Mutex, Semaphore } = require('async-mutex');

const writeMutex = new Mutex();
const readSemaphore = new Semaphore(10); // allow 10 ppl to acess

// copied pretty much all of this code from devsoc mail!

// TODO: change the type of session store, using any is bad practice.
let sessionStore: SessionStore = { sessions: [] };
let database: DataStore = { users: [], elections: [] };

export let userDatabase: Map<string, string> = new Map();
let electionDatabase: Map<string, Election> = new Map();

// const SESSION_PATH = "./src/data/sessions.json";
// const USER_DATABASE_PATH = "./src/data/userDatabase.json";
// const path = require('path');
// const USER_DATABASE_PATH = path.join(__dirname, 'data', 'userDatabase.json');
const USER_DATABASE_PATH = './src/data/userDatabase.json';
const SESSIONSTORE_PATH = './src/data/sessions.json'
// importing instance of mutex & semaphore

// TODO: move this to a .env file! and put the .env in .gitignore
const secretKey = 'abcde12345';

////////////////////////////// SESSION UTILS  ////////////////////////////////

// export function saveSessions() {
//   const data = JSON.stringify(sessionStore, null, 2);
//   fs.writeFileSync(SESSION_PATH, data, { flag: 'w' });
// }

// export function loadSessions() {
//   if (fs.existsSync(SESSION_PATH)) {
//     const data = fs.readFileSync(SESSION_PATH, { flag: 'r' });
//     sessionStore = JSON.parse(data.toString());
//   } else {
//     // if file doesn't exist
//     saveSessions();
//   }
// }

/**
 * Creates and registers a session for a given userId.
 * Returns the generated sessionId (JWT).
 */
export function createAndStoreSession(userId: string): string {
  const sessionId = generateSessionId(userId);
  const session: Session = {
    sessionId,
    userId,
    createdAt: new Date(),
  };

  const sessions = getSessions();
  sessions.sessions.push(session);
  setSessions(sessions);

  return sessionId;
}

export function getSessions(): SessionStore {
  return sessionStore;
}

export function setSessions(sessions: SessionStore) {
  sessionStore = sessions;
  saveSessionToFile();
}

////////////////////////////// DATA UTILS  ///////////////////////////////////

// export function saveData() {
//   const data = JSON.stringify(database, null, 2);
//   fs.writeFileSync(DATA_PATH, data, { flag: 'w' });
// }

// export function loadData() {
//   if (fs.existsSync(DATA_PATH)) {
//     const data = fs.readFileSync(DATA_PATH, { flag: 'r' });
//     database = JSON.parse(data.toString());
//   } else {
//     // if file doesn't exist
//     saveData();
//   }
// }

// export function getData() {
//   return database;
// }

// export function setData(newData: DataStore) {
//   database = newData;
//   saveData();
// }

// create a getUserData function to modify
export const getUserData = async (
  modifier: (map: Map<string, string>) => void
): Promise<void> => {
  const release = await writeMutex.acquire();
  try {
    modifier(userDatabase);
    // await saveUserDataBaseToFile(); // optionally persist changes
  } finally {
    release();
  }
};

export const loadUserDatabaseFromFile = async (): Promise<void> => {
  const release = await writeMutex.acquire();

  try {
    const data = await fs.readFile(USER_DATABASE_PATH, 'utf8');
  
    // if (!data.trim()) {
    //   console.warn('User database file is empty. Starting with an empty userDatabase.');
    //   userDatabase.clear();
    //   return;
    // }
  
    const obj = JSON.parse(data) as Record<string, string>;

    userDatabase.clear();
    for (const [id, user] of Object.entries(obj)) {
      userDatabase.set(id, user);
    }

    console.log('User database loaded from file.');
  } catch (err) {
    console.error('Error loading user database:');
  } finally {
    release();
  }
};

export const loadSessionFromFile = async (): Promise<void> => {
  const release = await writeMutex.acquire();

  try {
    const data = await fs.readFile(SESSIONSTORE_PATH, 'utf8');

    if (!data.trim()) {
      console.warn('Session file is empty. Starting with an empty sessionStore.');
      sessionStore = { sessions: [] };
      return;
    }

    const obj = JSON.parse(data) as SessionStore;
    sessionStore = obj;
    console.log('Session store loaded from file.');
  } catch (err) {
    console.error('Error loading session store:', err);
  } finally {
    release();
  }
}

export const saveSessionToFile = async () => {
  const release = await writeMutex.acquire();
  try {
    const json = JSON.stringify(sessionStore, null, 2);
    await fs.writeFile(SESSIONSTORE_PATH, json, 'utf8');
    console.log(`Session store saved to ${SESSIONSTORE_PATH}`);
  } catch (err) {
    console.error('Error saving session store:', err);
  } finally {
    release();
  }
}

export const saveUserDataBaseToFile = async (): Promise<void> => {
  const release = await writeMutex.acquire();
  try {
    const obj = Object.fromEntries(userDatabase);
    const json = JSON.stringify(obj, null, 2);
    await fs.writeFile(USER_DATABASE_PATH, json, 'utf8');
    console.log(`User database saved to ${USER_DATABASE_PATH}`);

  } finally {
    release();
  }
} 

export const clear = async (): Promise<void>  => {
  // Acquire mutex to safely modify shared data
  const release = await writeMutex.acquire();

  try {
    // Clear in-memory stores
    userDatabase.clear();

    // Persist cleared user database
    await saveUserDataBaseToFile();

    // If you decide to persist sessions or elections to disk, you'd also save them here
    // Example:
    // saveSessions(); 
    // saveElectionDatabase(); 
    console.log('All in-memory data cleared and user database file reset.');
  } finally {
    release();
  }
}

////////////////////////////// DELETE UTILS  ////////////////////////////////
// clears the entire database, as well as clears out all existing sessions.
// export function clear() {
//   // Reset both memory and files
//   const data = getData();
//   data.users = [];
//   data.elections = [];

//   const session = getSessions();
//   session.sessions = [];
  
//   setData(data);
//   setSessions(session);

//   return {};
// }
