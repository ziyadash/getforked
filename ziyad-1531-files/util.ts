import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Colours } from './interface';

// a file that contains util functions that are used repeatedly throughout
// the code

// user logs in or registers to start a 'session'
// all session id's will be 10 digits long
export function generateSessionId() {
  const sessionId = String(Math.floor(Math.random() * Math.pow(10, 10))).padStart(10, '0');
  return sessionId;
}

// checks if a sessionId is valid i.e. is a string and has a length of 10
export function sessionIdValidator(sessionId: string) {
  if (typeof sessionId !== 'string' || sessionId.length !== 10) {
    return false;
  }
  return true;
}

// Used to create IDs for things that aren't tokens
export function generateNumericalId() {
  const uniqueId = uuidv4();
  // Removes any hyphens and white space that may show up in generated id
  const strippedId = uniqueId.replace(/-/g, '');
  let integerId = 0;
  // for loop in order to remove letter and replace it with a hexadecimal value corresponding to it
  for (let i = 0; i < strippedId.length; i++) {
    const hexDigit = parseInt(strippedId[i], 16);
    integerId = (integerId << 4) | hexDigit;
  }

  return integerId;
}

// Based on lecture 9.2 code
// Used to hash passwords
export function getHashOf(plaintext: string) {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}

// create N digit string
export function generateNDigitString(N: number) {
  const min = Math.pow(10, N - 1);
  const max = Math.pow(10, N) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// gets a random colour, used for setting the colour property of answers
export function getRandomColor(): Colours {
  const values = Object.values(Colours);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as Colours;
}

// used for the player join function, if a name is not supplied.
// a name is genned with
export function generateRandomName(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  let name = '';

  // Generate 5 random letters without repetitions
  for (let i = 0; i < 5; i++) {
    let randomLetter;
    do {
      randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    } while (name.includes(randomLetter));
    name += randomLetter;
  }

  // Generate 3 random numbers without repetitions
  for (let i = 0; i < 3; i++) {
    let randomNumber;
    do {
      randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
    } while (name.includes(randomNumber));
    name += randomNumber;
  }

  return name;
}

// used in player.ts as an abstraction of splicing to improve readability
export function removeFromArray(array: string[], name: string) {
  const index = array.indexOf(name);
  array.splice(index, 1);
}

// similar to above
export function removeFromCorrectRankScore(array: any, name: string) {
  const index = array.findIndex((item: any) => item.name === name);
  array.splice(index, 1);
}

// Helper function that takes in an answerId array and filters through it checking if
// multiple answerIds that are the same exist
export function checkDuplicateAnswerIds(answerIds: number[]) {
  const duplicateAnswers = answerIds.filter((answer, index) => answerIds.indexOf(answer) !== index);
  return duplicateAnswers.length > 0;
}
