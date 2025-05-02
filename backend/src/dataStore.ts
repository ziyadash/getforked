import fs from 'fs';
import { DataStore, Session, SessionStore } from './models/auth';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// copied pretty much all of this code from devsoc mail!

// TODO: change the type of session store, using any is bad practice.
let sessionStore: SessionStore = { sessions: [] };
let database: DataStore = { users: [] };

const SESSION_PATH = "./src/sessions.json";
const DATA_PATH = "./src/database.json";

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

export function generateUserId() {
  return uuidv4();
}

// UPDATED to use a JWT token instead!
export function generateSessionId(userId: string): string {
  const payload = { userId };
  // VERY INTERESTINGLY, we can define an optional expiry time:
  // const token = jwt.sign(payload, secretKey, { expiresIn: '24h' }); 
  // which may be of use in ensuring voters can vote only in a certain time frame?
  // although at the moment we aren't really considering the voting flow, only the 
  // create vote flow. but just something to note of course. 
  const token = jwt.sign(payload, secretKey); 
  return token;
}

// Verify a given token, use our super secret key
// I know we said not to use try catch blocks, but I feel that it makes the
// implementation here neater. 
export function verifySessionId(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string };
    return decoded;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
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

////////////////////////////// MISC UTILS  ////////////////////////////////
// clears the entire database, as well as clears out all existing sessions.
export function clear() {
  // Reset both memory and files
  setData({ users: [] });
  setSessions([]);

  return {};
}


// we want to compute the hash of a username and zID.
// we don't need to hash passwords since they are not stored anywhere..
// note: the zid + zpass verification endpoint only takes the plaintext in
// for an MVP this is fine, but I was digging around the codebase for Notangles
// and I think they use OAuth for zid + zpass verification which is much more secure
// for a production level codebase. 
export function getHashOf(plaintext: string) {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}
