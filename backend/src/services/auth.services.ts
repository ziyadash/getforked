import { getData, setData, getSessions, setSessions, generateSessionId } from '../dataStore';
import { StatusCodes } from 'http-status-codes';
import { Question, Election, Session, User } from '../../../shared/interfaces';
////////////// Util function(s) //////////////
/**
 * Uses the CSESoc zId + zPass verification API endpoint, returns the user's name on success 
 * @param zId 
 * @param zPass 
 * @returns 
 */
async function verifyZidCredentials(zId: string, zPass: string): Promise<{ displayName: string }> {
  const payload = { zid: zId, zpass: zPass };

  const response = await fetch('https://verify.csesoc.unsw.edu.au/v1', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === StatusCodes.UNAUTHORIZED) {
    throw new Error('Incorrect password');
  }

  if (!response.ok) {
    throw new Error(`Verification failed with status ${response.status}`);
  }

  return await response.json(); // contains { displayName }
}

////////////// Main logic function(s) //////////////

/**
 * Registers a user and logs then in, returns the assigned sessionId
 * @param zId 
 * @param zPass 
 * @returns 
 */
export async function authRegister(zId: string, zPass: string): Promise<string> {
  const { displayName } = await verifyZidCredentials(zId, zPass);

  const db = getData();
  const exists = db.users.find((u) => u.zId === zId);

  if (exists) {
    throw new Error('User already registered');
  }

  const newUser: User = { name: displayName, zId: zId };
  db.users.push(newUser);
  setData(db);

  const sessionId = generateSessionId();
  const newSession: Session = { sessionId, userZId: zId };

  const sessions = getSessions();
  sessions.push(newSession);
  setSessions(sessions);

  return sessionId;
}

/**
 * Logs in an existing user and returns a session ID.
 * @param zId 
 * @param zPass 
 * @returns 
 */
export async function authLogin(zId: string, zPass: string): Promise<string> {
  await verifyZidCredentials(zId, zPass);

  const db = getData();
  const user = db.users.find((u) => u.zId === zId);

  if (!user) {
    throw new Error('User not registered');
  }

  const sessionId = generateSessionId();
  const newSession: Session = { sessionId, userZId: zId };

  const sessions = getSessions();
  sessions.push(newSession);
  setSessions(sessions);

  return sessionId;
}

/**
 * Logs out the user by removing their session.
 */
export function authLogout(sessionId: string) {
  const sessions = getSessions().filter((s) => s.sessionId !== sessionId);
  setSessions(sessions);
}


// figure out how to get sessionId
export const authCreateVoteSession = (
  userSessionId: string,
  title: string,
  description: string,
  images: string[],
  startDate: Date,
  endDate: Date,
  zid_requirement: boolean,
  locationOfVote?: string,
) : number => {
  const db = getData();
  const sessions = getSessions();

  if (!db) {
    throw new Error('Failed to load data store');
  }

  // find user zId:
  const session = sessions.find((session) => session.sessionId === userSessionId);
  
  if (!session) throw new Error('Invalid session ID');

  const userZId = session.userZId;


  if (title.length <= 0) {
    throw new Error('Title cannot be empty');
  }

  const questions: Question[] = [];

  const newElection: Election = {
    id: db.elections.length + 1, // subject to change
    authUserZId: userZId,
    name: title,
    description: description,
    images: images,
    location: locationOfVote,
    date_time_start: startDate,
    date_time_end: endDate,
    requires_zid: zid_requirement,
    questions,
  };

  db.elections.push(newElection);
  setData(db);

  return newElection.id;
}
