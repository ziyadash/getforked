import isEmail from 'validator/lib/isEmail.js';
import { getData, setData } from './dataStore';

// importing interfaces and helper functions
import { ErrorMsg, UserDetail } from './interface';
import { getHashOf } from './util';

/**
 * Register a user with an email, password, and names, then returns their
 * authUserId value.
 *
 * @param {string} email - user's email
 * @param {string} password - user's password
 * @param {string} nameFirst - user's first name
 * @param {string} nameLast - user's last name
 * @returns {
 *   {
 *     authUserId: number,
 *   }
 * } - an object containing the new user's ID
 */
function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): { authUserId: number } | ErrorMsg {
  const data = getData();

  // Check that the email is valid
  if (!isEmail(email)) {
    return { error: 'Invalid email' };
  }

  // Password should be at least 8 characters
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }
  // Password should contain at least 1 number and at least 1 letter
  // Uses regular expressions to verify these conditions
  if (!/\d/.test(password)) {
    return { error: 'Password must contain at least 1 number' };
  } else if (!/[a-zA-Z]/.test(password)) {
    return { error: 'Password must contain at least 1 letter' };
  }

  // Check that nameFirst and nameLast have a valid number of characters
  if (nameFirst.length < 2) {
    return { error: 'First name must be at least 2 characters' };
  } else if (nameFirst.length > 20) {
    return { error: 'First name cannot be more than 20 characters' };
  }
  if (nameLast.length < 2) {
    return { error: 'Last name must be at least 2 characters' };
  } else if (nameLast.length > 20) {
    return { error: 'Last name cannot be more than 20 characters' };
  }

  // Check that nameFirst and nameLast don't contain any special characters
  // Uses regex again
  if (!/^[a-zA-Z\s'-]+$/.test(nameFirst)) {
    return { error: 'First name cannot contain characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
  } else if (!/^[a-zA-Z\s'-]+$/.test(nameLast)) {
    return { error: 'Last name cannot contain characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
  }

  // Check that the given email is not already in use
  for (const user of data.users) {
    // An email should be considered duplicate even if it uses different cases
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return { error: 'Email address already used by another user' };
    }
  }

  // Use the number of users as the ID
  const userId = data.users.length;

  // We need to hash the password before storing it
  const hashedPassword = getHashOf(password);

  // All details are correct, so add the user
  data.users.push({
    userId: userId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: hashedPassword,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    oldPasswords: [],
  });
  setData(data);

  return { authUserId: userId };
}

/**
 * Given a registered user's email and password returns their authUserId value.
 *
 * @param {string} email - user's email
 * @param {string} password - user's password
 * @returns {
 *  {
 *    authUserId: number,
 *  }
 * } - an object containing the user's ID
 */
function adminAuthLogin(email: string, password: string): { authUserId: number } | ErrorMsg {
  const data = getData();

  // Search for a user with a matching email
  for (const user of data.users) {
    // Ignore case when checking if emails are equal
    if (user.email.toLowerCase() === email.toLowerCase()) {
      // Check that the given password matches the hashed password
      if (user.password === getHashOf(password)) {
        // The user has sucessfully logged in, so increment numSuccessfulLogins
        // and set failed password attempts to 0
        user.numSuccessfulLogins++;
        user.numFailedPasswordsSinceLastLogin = 0;
        setData(data);

        return { authUserId: user.userId };
      } else {
        // The user has entered an incorrect password, so increment
        // the number of failed password attempts
        user.numFailedPasswordsSinceLastLogin++;
        setData(data);

        return { error: 'Password is not correct for the given email' };
      }
    }
  }

  // If we reached this point, we didn't find a matching email
  return { error: 'Email address does not exist' };
}

/**
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated
 * with a single space between them.
 *
 * @param {number} authUserId - an object containing the user's ID.
 * @returns {
* user:
*  {
*    userID: number,
*    name: string,
*    email: string
*    numSuccessfulLogins: number,
*    numFailedPasswordsSinceLastLogin: number,
*  }
* }
*/
function adminUserDetails(authUserId: number): UserDetail | ErrorMsg {
  const data = getData();

  // Find the user with the given authUserId in the data store
  const user = data.users.find((user) => user.userId === authUserId);

  return {
    user: {
      userId: user.userId,
      name: `${user.nameFirst} ${user.nameLast}`,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    },
  };
}

/**
 *
 * @param {string} email - User's new email
 * @param {string} nameFirst - User's new first name
 * @param {string} nameLast - User's new last name
 * @param {number} authUserId - userId of designated user
 * @returns {} - an empty object
 */
function updateUserDetails(email: string, nameFirst: string, nameLast: string, authUserId: number): Record<string, never> | ErrorMsg {
  // Gets data from dataStore file
  const data = getData();

  // Filters the users array of data object to search for users with same email
  const filteredUsers = data.users.filter(element => element.email === email);
  const sameUser = filteredUsers.find(element => element.userId === authUserId);

  if (filteredUsers.length > 1 || (!sameUser && filteredUsers.length > 0)) {
    return { error: 'Email is already in use' };
  }

  // Checks if the email is valid
  if (!isEmail(email)) {
    return { error: 'Invalid email' };
  }

  // Checks if nameFirst and nameLast satisfy conditions
  if (!/^[a-zA-Z\s'-]+$/.test(nameFirst)) {
    return { error: 'First name cannot contain characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
  } else if (nameFirst.length < 2) {
    return { error: 'First name must be at least 2 characters long' };
  } else if (nameFirst.length > 20) {
    return { error: 'First name must be less than or equal to 20 characters long' };
  } else if (!/^[a-zA-Z\s'-]+$/.test(nameLast)) {
    return { error: 'Last name cannot contain characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
  } else if (nameLast.length < 2) {
    return { error: 'Last name must be at least 2 characters long' };
  } else if (nameLast.length > 20) {
    return { error: 'Last name must be less than or equal to 20 characters long' };
  }

  // Updates user information with parameters of function
  const designatedUser = data.users.find(element => element.userId === authUserId);
  designatedUser.email = email;
  designatedUser.nameFirst = nameFirst;
  designatedUser.nameLast = nameLast;

  setData(data);
  return {};
}

/**
 * If the new password is valid, updates the user's password to it.
 *
 * @param {number} authUserId - the ID of the user
 * @param {string} oldPassword - the current password
 * @param {string} newPassword - the new password
 *
 * @returns {} - the empty object
 */
function updateUserPassword(authUserId: number, oldPassword: string, newPassword: string) {
  const data = getData();
  const user = data.users.find(element => element.userId === authUserId);

  const hashedOldPassword = getHashOf(oldPassword);
  const hashedNewPassword = getHashOf(newPassword);

  // Checks if hashedOldPassword inputted matches password in user object
  if (user.password !== hashedOldPassword) {
    return { error: 'Old password inputted is not correct' };
  }
  user.oldPasswords.push({ oldPassword: hashedOldPassword });

  // Checks if user has used new password before
  const checkNewPassword = user.oldPasswords.find(element => element.oldPassword === hashedNewPassword);
  if (checkNewPassword !== undefined) {
    return { error: 'The new password has already been used before' };
  }

  // Checks to make sure that new password is at least 8 characters long
  if (newPassword.length < 8) {
    return { error: 'New password must at least 8 characters long' };
  }

  // Checks if new password has at least one letter and one number
  if (!/\d/.test(newPassword)) {
    return { error: 'Password must contain at least 1 number' };
  } else if (!/[a-zA-Z]/.test(newPassword)) {
    return { error: 'Password must contain at least 1 letter' };
  }

  user.password = hashedNewPassword;
  setData(data);
  return {};
}

// Exporting all the functions so that they can be used in the test file
export {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  updateUserDetails,
  updateUserPassword,
};
