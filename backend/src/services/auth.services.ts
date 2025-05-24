import {
  // getSessions,
  // setSessions,
  // createAndStoreSession,
  userDatabase,
  saveUserDataBaseToFile,
  createAndStoreSession
} from '../data/dataStore';
import { getHashOf, } from '../data/dataUtil';
import { StatusCodes } from 'http-status-codes';
import { decryptData } from '../../../shared/src/encryptionBackend';
import { Question, Election, Session, User } from '../../../shared/interfaces';
import { write } from 'fs';
import { rawListeners } from 'process';

// get instance of mutex
const { writeMutex } = require('../data/syncPrimitives');
const USER_DATABASE_PATH = require('../data/userDatabase.json'); // not 100% sure if this is correct
const fs = require('fs/promises');


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

  const release = await writeMutex.acquire();
  let registerRes: { sessionId?: string; error?: string; status?: number } = {};

  try {
    if (userDatabase.has(userId)) {
      console.log("EORRRRRRRRRRRRRR")
      release();
      return  { error: 'User already registered', status: StatusCodes.CONFLICT };
    }

    userDatabase.set(userId, hashedName);
    console.log("user database SAVEDD TO DATA, NOW TO PERSIST THE DATA");
    await saveUserDataBaseToFile();
  } finally {
    release();
  }

  console.log("THIS IS THE USER ID " + userDatabase.get(userId));
  const sessionId = createAndStoreSession(userId);

  return registerRes;
}

// /**
//  * Logs in an existing user and returns a session ID.
//  * @param zId 
//  * @param zPass 
//  * @returns 
//  */
export async function authLogin(zId: string, zPass: string): Promise<{ sessionId?: string; error?: string; status?: number }> {
  // decrypt first
  const decryptedZID = decryptData(zId);
  const decryptedZPass = decryptData(zPass);

  const result = await verifyZidCredentials(decryptedZID, decryptedZPass);
  if (result.error) return result;

  const userId = getHashOf(decryptedZID);
  // const db = getData();
  // const user = db.users.find((u) => u.userId === userId);
  const user = userDatabase.get(userId);

  if (!user) {
    return { error: 'User not registered', status: StatusCodes.NOT_FOUND };
  }

  // const sessionId = createAndStoreSession(userId);

  return { };
}

// /**
//  * @param sessionId
//  * Logs out the user by removing their session.
//  */
// export function authLogout(sessionId: string): { error?: string; status?: number } | void {
//   const sessions = getSessions();
//   const sessionExists = sessions.sessions.some(s => s.sessionId === sessionId);

//   if (!sessionExists) {
//     return {
//       error: 'Invalid session token',
//       status: StatusCodes.UNAUTHORIZED,
//     };
//   }

//   sessions.sessions.filter(s => s.sessionId !== sessionId);
//   setSessions(sessions);
// }