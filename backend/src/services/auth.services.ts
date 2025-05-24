import {
  // getSessions,
  // setSessions,
  // createAndStoreSession,
  getUserData,
  saveUserDataBaseToFile,
  createAndStoreSession,
  getSessions,
  setSessions
} from '../data/dataStore';
import { getHashOf, } from '../data/dataUtil';
import { StatusCodes } from 'http-status-codes';
import { decryptData } from '../../../shared/src/encryptionBackend';

////////////// Util function(s) //////////////
/**
 * Uses the CSESoc zId + zPass verification API endpoint, returns the user's name on success 
 * @param zId 
 * @param zPass 
 * @returns 
 */
async function verifyZidCredentials(zId: string, zPass: string): Promise<{ displayName?: string; error?: string; status?: number }> {
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
    return { error: 'Incorrect password', status: StatusCodes.UNAUTHORIZED };
  }

  if (!response.ok) {
    return {
      error: `Verification failed with status ${response.status}`,
      status: StatusCodes.BAD_GATEWAY,
    };
  }

  const data = await response.json();
  if (!data.displayName) {
    return { error: 'Malformed verification response', status: StatusCodes.INTERNAL_SERVER_ERROR };
  }

  return { displayName: data.displayName };
}

////////////// Main logic functions //////////////

// Notice that we decrypt the inputted zId and zPass, since they are encrypted from the frontend

// /**
//  * Registers a user and logs then in, returns the assigned sessionId
//  * @param zId 
//  * @param zPass 
//  * @returns 
//  */
// export async function authRegister(zId: string, zPass: string): Promise<{ sessionId?: string; error?: string; status?: number }> {
//   // decrypt first
//   const decryptedZID = decryptData(zId);
//   const decryptedZPass = decryptData(zPass);

//   const result = await verifyZidCredentials(decryptedZID, decryptedZPass);
//   if (result.error) return result;

//   const userId = getHashOf(decryptedZID);
//   const db = getData();

//   if (db.users.find((u) => u.userId === userId)) {
//     return { error: 'User already registered', status: StatusCodes.CONFLICT };
//   }

//   const hashedName = getHashOf(result.displayName!);
//   db.users.push({ userId: userId, name: hashedName });
//   setData(db);
  
//   const sessionId = createAndStoreSession(userId);

//   return { sessionId };
// }

/**
 * Registers a user and logs then in, returns the assigned sessionId
 * @param zId 
 * @param zPass 
 * @returns 
 */
export async function authRegister(zId: string, zPass: string): Promise<{ sessionId?: string; error?: string; status?: number }> {
  // decrypt first
  const decryptedZID = decryptData(zId);
  const decryptedZPass = decryptData(zPass);

  const result = await verifyZidCredentials(decryptedZID, decryptedZPass);
  if (result.error) return result;

  const userId = getHashOf(decryptedZID);

  const hashedName = getHashOf(result.displayName!);

  await getUserData(map => {
    if (map.has(userId)) {
      return  { error: 'User already registered', status: StatusCodes.CONFLICT };
    }
    map.set(userId, hashedName);
  })

    await saveUserDataBaseToFile();

  const sessionId = createAndStoreSession(userId);

  return { sessionId };
}

/**
 * Logs in an existing user and returns a session ID.
 * Prevents multiple sessions for the same user.
 */
export async function authLogin(zId: string, zPass: string): Promise<{ sessionId?: string; error?: string; status?: number }> {
  // Decrypt inputs
  const decryptedZID = decryptData(zId);
  const decryptedZPass = decryptData(zPass);

  // Verify credentials (e.g. against UNSW API or dummy auth)
  const result = await verifyZidCredentials(decryptedZID, decryptedZPass);
  if (result.error) return result;

  // Hash ZID to get userId
  const userId = getHashOf(decryptedZID);

  let userExists = false;

  await getUserData(map => {
    userExists = map.has(userId);
  });

  if (!userExists) {
    return { error: 'User not registered', status: StatusCodes.NOT_FOUND };
  }

  // Check if user already has an active session
  const sessions = getSessions().sessions;
  const existingSession = sessions.find(session => session.userId === userId);

  if (existingSession) {
    return { error: 'User already logged in', status: StatusCodes.CONFLICT };
  }

  // Create and return new session
  const sessionId = createAndStoreSession(userId);
  return { sessionId };
}

/**
 * Logs out the user by removing their session.
 */
export function authLogout(sessionId: string): { error?: string; status?: number } | void {
  const sessions = getSessions();
  const index = sessions.sessions.findIndex(s => s.sessionId === sessionId);

  if (index === -1) {
    return {
      error: 'Invalid session token',
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  sessions.sessions.splice(index, 1);
  setSessions(sessions);
}
