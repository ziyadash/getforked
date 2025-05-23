import fs from 'fs';
import { DataStore, Session, SessionStore } from '../../../shared/interfaces';
import {generateUserId, generateSessionId, verifySessionId, getHashOf } from './dataUtil';

// copied pretty much all of this code from devsoc mail!

// TODO: change the type of session store, using any is bad practice.
let sessionStore: SessionStore = { sessions: [] };
let database: DataStore = { users: [], elections: [] };

const SESSION_PATH = "./src/data/sessions.json";
const DATA_PATH = "./src/data/database.json";

// TODO: move this to a .env file! and put the .env in .gitignore
const secretKey = 'abcde12345';

////////////////////////////// SESSION UTILS  ////////////////////////////////

export function saveSessions() {
  const data = JSON.stringify(sessionStore, null, 2);
  fs.writeFileSync(SESSION_PATH, data, { flag: 'w' });
}

export function loadSessions() {
  if (fs.existsSync(SESSION_PATH)) {
    const data = fs.readFileSync(SESSION_PATH, { flag: 'r' });
    sessionStore = JSON.parse(data.toString());
  } else {
    // if file doesn't exist
    saveSessions();
  }
}

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
  sessions.push(session);
  setSessions(sessions);

  return sessionId;
}

export function getSessions(): Session[] {
  return sessionStore.sessions;
}

export function setSessions(sessions: Session[]) {
  sessionStore.sessions = sessions;
  saveSessions();
}

////////////////////////////// DATA UTILS  ///////////////////////////////////

export function saveData() {
  const data = JSON.stringify(database, null, 2);
  fs.writeFileSync(DATA_PATH, data, { flag: 'w' });
}

export function loadData() {
  if (fs.existsSync(DATA_PATH)) {
    const data = fs.readFileSync(DATA_PATH, { flag: 'r' });
    database = JSON.parse(data.toString());
  } else {
    // if file doesn't exist
    saveData();
  }
}

export function getData() {
  return database;
}

export function setData(newData: DataStore) {
  database = newData;
  saveData();
}

////////////////////////////// DELETE UTILS  ////////////////////////////////
// clears the entire database, as well as clears out all existing sessions.
export function clear() {
  // Reset both memory and files
  setData({ users: [], elections: [] });
  setSessions([]);

  return {};
}
