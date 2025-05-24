import { createTimers, getData, getTimers, setData } from './dataStore';
import fs from 'fs';
import request from 'sync-request';

// importing interfaces and an enum for colours
import { Answers, ErrorMsg, QuizListItem, QuizInfo, QuizState, QuizSessionAction, FinalQuizResults, QuestionResults, QuestionCorrectBreakdown } from './interface';
import { generateNumericalId, generateNDigitString, getRandomColor } from './util';
import validator from 'validator';
import config from './config.json';

/**
 * Allows a user to create a quiz based on information they give the program.
 * Keeps track of the users Id and name in order to identify who created the
 * quiz
 *
 * @param {string} token - Id of user making modifications
 * @param {string} name - user's first name
 * @param {string} description - user's last name
 * @returns {
*   {
    *     quizId: number,
    *   }
    * } - a unique integer to direct us to any given quiz.
    */

function adminQuizCreate(authUserId: number, name: string, description: string): { quizId: number } | ErrorMsg {
  // Regex variable in order to test if quiz name contains illegal elements
  const regex = /[^a-zA-Z0-9\s]/;
  const data = getData();
  const integerId = generateNumericalId();

  if (name.length < 3 || name.length > 30) {
    return { error: 'The quiz name should be greater than 3 character but less than 30' };
  }
  // Uses regex test to check for illegal elements
  if (regex.test(name) === true) {
    return { error: 'The quiz name should contain alphanumeric values and spaces only' };
  }
  // If a quiz name already falls underneath a user return an error object
  if (data.quizzes.find(quiz => quiz.name === name && quiz.authUserId === authUserId)) {
    return { error: 'A quiz with this name already exists' };
  }

  if (description.length > 100) {
    return { error: 'Quiz description should be less than 100 characters.' };
  }

  data.quizzes.push(
    {
      authUserId: authUserId,
      // Math.abs is used as the for loop can return negative numbers
      quizId: Math.abs(integerId),
      name: name,
      // Used in order to create a Unix timestamp in seconds
      timeCreated: Math.floor(Date.now() / 1000),
      timeLastEdited: Math.floor(Date.now() / 1000),
      description: description,
      totalDuration: 0,
      numQuestions: 0,
      questions: [],
      thumbnailUrl: ''
    }
  );

  setData(data);

  return {
    quizId: Math.abs(integerId)
  };
}

/**
 * Allows a user to permanently remove any given quiz.
 *
 * @param {number} authUserId - Id of user making modifications
 * @param {number} quizId - Id of quiz being removed
 * @returns {
 *  {}
 * } - an empty object
 */
function adminQuizRemove(authUserId: number, quizId: number): Record<string, never> | ErrorMsg {
  const data = getData();
  const isQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const isOwned = data.quizzes.find(quiz => quiz.quizId === quizId &&
  quiz.authUserId === authUserId);

  // If quiz id dosen't exist throw error
  if (!isQuiz) {
    return { error: 'The quiz id is not valid' };
  }
  // If quiz object dosen't contain user id return error
  if (!isOwned) {
    return { error: 'The user does not own the quiz' };
  }

  // Finds index of quiz to remove and removes it
  const quizIndex = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  data.trash.push(isQuiz);
  data.quizzes.splice(quizIndex, 1);
  setData(data);

  return { };
}

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * @param {number} authUserId - a number object that stores the user's ID
 * @returns {
* quizzes:
*  [
*      {quizId: number, name: string,}
*  ]
* }
*
*/
function adminQuizList(authUserId: number): { quizzes: QuizListItem[] } | ErrorMsg {
  const data = getData();
  const quizList: { quizzes: QuizListItem[] } = {
    quizzes: []
  };

  // Iterate through data.quizzes and collect quizzes associated with the user
  for (const quiz of data.quizzes) {
    if (quiz.authUserId === authUserId) {
      quizList.quizzes.push({
        quizId: quiz.quizId,
        name: quiz.name
      });
    }
  }

  return quizList;
}

/**
 * Get all of the relevant information about the current quiz.
 *
 * @param {number} authUserId - Id of user checking a particular quiz's information
 * @param {number} quizId - Id of quiz being checked
 * @returns {
 *      quizId: number,
 *      name: string,
 *      timeCreated: number,
 *      timeLastEdited: number,
 *      description: string,
 * }
 */
function adminQuizInfo(authUserId: number, quizId: number): QuizInfo | ErrorMsg {
  const data = getData();

  // Checks if quizId is valid
  const allQuizzes = data.quizzes.concat(data.trash);
  const quiz = allQuizzes.find((element) => element.quizId === quizId);
  if (!quiz) {
    return { error: 'A quiz with this ID does not exist' };
  }

  // Check if parameter authUserId matches authUserId in quiz
  const info = allQuizzes.find((element) => element.authUserId === authUserId && element.quizId === quizId);
  if (!info) {
    return { error: 'User does not own this quiz' };
  }

  return {
    quizId: quizId,
    name: info.name,
    timeCreated: info.timeCreated,
    timeLastEdited: info.timeLastEdited,
    description: info.description,
    numQuestions: info.numQuestions,
    questions: info.questions,
    duration: info.totalDuration,
    thumbnailUrl: info.thumbnailUrl
  };
}

/**
 * Update the name of the relevant quiz.
 *
 * @param {number} authUserId - Id of user updating the quiz's name
 * @param {number} quizId - Id of the quiz being updated
 * @param {string} name - New name of the quiz
 * @returns {} - An empty object
 */
function adminQuizNameUpdate(authUserId: number, quizId: number, name: string): Record<string, never> | ErrorMsg {
  const data = getData();

  // Checks if quizId is valid
  const quiz = data.quizzes.find((element) => element.quizId === quizId);
  if (!quiz) {
    return { error: 'A quiz with this ID does not exist' };
  }

  // Check if parameter authUserId matches authUserId in quiz
  const info = data.quizzes.find((element) => element.authUserId === authUserId && element.quizId === quizId);
  if (!info) {
    return { error: 'User does not own this quiz' };
  }

  // Check if name contains any non-alphanumerical characters
  if (/[^a-zA-Z0-9\s]/.test(name) === true) {
    return { error: 'New quiz name must consist of alphanumerical characters and/or spaces only' };
  }

  // Check if name is less than 3 characters long or less than 30 characters long
  if (name.length < 3) {
    return { error: 'New quiz name is shorter than 3 characters' };
  } else if (name.length > 30) {
    return { error: 'New quiz name is longer than 30 characters' };
  }

  // Checks if the new name for a quiz is being used by another quiz of the same user
  const quizname = data.quizzes.find(element => element.name === name);
  if (typeof quizname !== 'undefined') {
    return { error: 'There exists a quiz that already uses this new name' };
  }

  // Function successfully runs
  quiz.name = name;
  quiz.timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);

  return {};
}

/**
 * Update the description of the relevant quiz
 *
 * @param {number} authUserId - Id of user updating the quiz's description
 * @param {number} quizId - Id of the quiz being updated
 * @param {string} description - New description of the quiz
 * @returns {} - An empty object
 */
function adminQuizDescriptionUpdate(authUserId: number, quizId: number, description: string): Record<string, never> | ErrorMsg {
  const data = getData();

  // Checks if quizId is valid
  const quiz = data.quizzes.find((element) => element.quizId === quizId);
  if (!quiz) {
    return { error: 'A quiz with this ID does not exist' };
  }

  // Check if parameter authUserId matches authUserId in quiz
  const relevantQuiz = data.quizzes.find((element) => element.authUserId === authUserId && element.quizId === quizId);
  if (!relevantQuiz) {
    return { error: 'User does not own this quiz' };
  }

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }

  if (relevantQuiz.description !== description) {
    relevantQuiz.description = description;
    relevantQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
  }
  return {};
}

/**
 * Transfer ownership of a quiz to a different user based on their email
 *
 * @param {number} authUserId - ID of currently authenticated user
 * @param {string} email - Email of user the quiz is being transferred to
 * @param {number} quizId - ID of quiz being transferred
 * @returns {
 *   {}
 * } - an empty object
 */
function adminQuizTransfer(authUserId: number, email: string, quizId: number): Record<string, never> | ErrorMsg {
  const data = getData();

  // Quiz ID does not refer to a valid quiz
  const quiz = data.quizzes.find(element => element.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Quiz ID does not refer to a quiz that this user owns
  if (authUserId !== quiz.authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // userEmail is not a real user
  const transferredUser = data.users.find(element => element.email === email);
  if (!transferredUser) {
    return { error: 'userEmail is not a real user' };
  }

  // userEmail is the current logged in user
  if (transferredUser.userId === authUserId) {
    return { error: 'userEmail is the current logged in user' };
  }

  // Quiz ID refers to a quiz that has a name that is already used by the target user
  const quizList = adminQuizList(transferredUser.userId) as { quizzes: QuizListItem[] };

  if (quizList.quizzes.find(element => element.name === quiz.name)) {
    return { error: 'Quiz ID refers to a quiz that has a name that is already used by the target user' };
  }

  // If there are no errors, transfer the quiz
  quiz.authUserId = transferredUser.userId;

  setData(data);

  return {};
}

/**
 * Permanently delete specific quizzes owned by user currently sitting in the trash
 *
 * @param {number} authUserId - Id of user emptying their own quizzes
 * @param {number[]} quizIds - Ids of the quiz/quizzes being emptied from trash
 * @returns {} - An empty object
 */
function adminQuizEmptyTrash(authUserId: number, quizIds: number[]): Record<string, never> | ErrorMsg {
  const data = getData();

  for (const quizId of quizIds) {
    const quiz = data.trash.find((element) => element.quizId === quizId);
    if (!quiz) {
      // Checks if the quiz that cannot be found in trash is actually a quiz that hasn't been deleted, if not present in the quiz array, it is not a real quiz
      const quizNotInTrash = data.quizzes.find((element) => element.quizId === quizId);
      if (!quizNotInTrash) {
        return { error: 'One or more of the Quiz IDs is not a valid quiz' };
      } else {
        return { error: 'One or more of the Quiz IDs is not currently in the trash' };
      }
    }
  }

  // Checks if there is a quizId that is not present in the trashed quizzes array that the User owns
  for (const quizId of quizIds) {
    const relevantQuiz = data.trash.find((element) => element.authUserId === authUserId && element.quizId === quizId);
    if (!relevantQuiz) {
      return { error: 'One or more of the Quiz IDs refers to a quiz that this current user does not own' };
    }
  }

  const emptiedtrash = data.trash.filter(trash => trash.authUserId !== authUserId);
  data.trash = emptiedtrash;

  setData(data);
  return {};
}

/**
 * Creates a question for a particular quiz
 *
 * @param {number} authUserId - Id of user who owns quiz
 * @param {number} quizId - Id of particular quiz
 * @param {string} question - The actual question
 * @param {number} duration - the length of time the question is active for (we deal with states later)
 * @param {number} points - number of points a question is worth
 * @param {Answers[]} answers - an array of answer objects, which contain an answer string and a bool
 * @returns {
 *  questionId: number
 * } - the Id of the generated question
*
*/
function adminQuestionCreate(authUserId: number, quizId: number, question: string, duration: number, points: number, answers: Answers[], thumbnail?: string) {
  // NOTE: thumbnail is an optional argument. we should check if
  // 1. thumbnail === undefined i.e. was the argument even passed in?, iter2
  // 2. thumbnail === '' empty string i.e. they specifically passed in an empty string, iter3
  // if thumbnail argument is not given, its fine, we continue.
  const data = getData();
  const isQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const isOwned = data.quizzes.find(quiz => quiz.quizId === quizId && quiz.authUserId === authUserId);

  // If quizId dosen't exist throw error
  if (!isQuiz) {
    return { error: 'The quiz id is not valid' };
  }
  // If quiz object dosen't contain correct userId return error
  if (!isOwned) {
    return { error401: 'The user does not own the quiz' };
  }

  if (question.length < 5 || question.length > 50) {
    return { error: 'The question is either less than 5 characters or more than 30 characters in length' };
  }

  if (answers.length < 2 || answers.length > 6) {
    return { error: 'There are either less than 2 answers or more than 6' };
  }

  if (duration <= 0) {
    return { error: 'The duration must be positive' };
  }

  const totalDuration = isQuiz.questions.reduce((acc, curr) => acc + curr.duration, 0) + duration;
  if (totalDuration > 180) {
    return { error: 'The total duration of the quiz will exceed 3 minutes' };
  }

  if (points <= 0 || points > 10) {
    return { error: 'The points awarded for this question are less than 1 or greater than 10' };
  }

  for (const it of answers) {
    if (it.answer.length < 1 || it.answer.length > 30) {
      return { error: 'the length of the answer is either less than 1 or greater than 30' };
    }
  }

  const isDuplicateAnswer = checkDuplicateAnswers(answers);
  if (isDuplicateAnswer) {
    return { error: 'Duplicate answer strings within the same question' };
  }

  const hasCorrectAnswer = answers.some(answer => answer.correct);
  if (!hasCorrectAnswer) {
    return { error: 'At least one correct answer is required' };
  }

  // If thumbnail argument is passed in, perform validation checks related to thumbnail
  if (thumbnail !== undefined) {
    if (thumbnail === '') {
      return { error: 'the thumbnail is an empty string' };
    }

    const validImgUrl = validator.isURL(thumbnail, { protocols: ['http', 'https'], require_tld: true });
    if (validImgUrl === false) {
      return { error: 'Invalid Image URL' };
    }

    if (!thumbnail.endsWith('.png') && !thumbnail.endsWith('.jpg')) {
      return { error: 'Image URL must be of type png or jpg' };
    }
  }

  // if we reach this point, we have passed all error checks
  // we gen a questionId and push the data to the quiz, and update some important fields.
  const questionId = generateNDigitString(6);

  // new thing: gen a 4 digit answerId for each answer
  // also gen a random colour
  for (const it of answers) {
    it.answerId = generateNDigitString(4);
    it.colour = getRandomColor();
  }

  const quizIndex = data.quizzes.indexOf(isQuiz);
  data.quizzes[quizIndex].timeLastEdited = Math.floor(Date.now() / 1000);
  data.quizzes[quizIndex].totalDuration += duration;
  data.quizzes[quizIndex].numQuestions++;

  data.quizzes[quizIndex].questions.push({
    questionId: questionId,
    question: question,
    duration: duration,
    points: points,
    answers: answers,
    thumbnailUrl: thumbnail,
  });

  setData(data);
  return { questionId };
}

function checkDuplicateAnswers(answers: Answers[]) {
  const answerStrings = answers.map((answer) => answer.answer);
  const duplicateAnswers = answerStrings.filter((answer, index) => answerStrings.indexOf(answer) !== index);
  return duplicateAnswers.length > 0;
}

/**
 * Creates a question for a particular quiz
 *
 * @param {number} authUserId - Id of user who owns quiz
 * @param {number} quizId - Id of particular quiz
 * @param {number} questionId - Id of particular question in said particular quiz
 * @param {string} question - The actual question
 * @param {number} duration - the length of time the question is active for (we deal with states later)
 * @param {number} points - number of points a question is worth
 * @param {Answers[]} answers - an array of answer objects, which contain an answer string and a bool
 * @returns {
*  quizId: number
* }
*
*/
function adminQuestionUpdate(authUserId: number, quizId: number, questionId: number, question: string, duration: number, points: number, answers: Answers[], thumbnail?: string) {
  // NOTE: thumbnail is an optional argument. we should check if
  // 1. thumbnail === undefined i.e. was the argument even passed in?, iter2
  // 2. thumbnail === '' empty string i.e. they specifically passed in an empty string, iter3
  const data = getData();
  const isQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const isOwned = data.quizzes.find(quiz => quiz.quizId === quizId && quiz.authUserId === authUserId);

  // If quizId dosen't exist throw error
  if (!isQuiz) {
    return { error: 'The quiz id is not valid' };
  }
  // If quiz object dosen't contain correct userId return error
  if (!isOwned) {
    return { error: 'The user does not own the quiz' };
  }

  // at this point, the quiz and userId exist, now we check if the questionId exists
  const quizIndex = data.quizzes.indexOf(isQuiz);
  const isQuestion = data.quizzes[quizIndex].questions.find(question => question.questionId === questionId);

  if (!isQuestion) {
    return { error: 'The question id is not valid' };
  }

  if (question.length < 5 || question.length > 50) {
    return { error: 'The question is either less than 5 characters or more than 30 characters in length' };
  }

  if (answers.length < 2 || answers.length > 6) {
    return { error: 'There are either less than 2 answers or more than 6' };
  }

  if (duration <= 0) {
    return { error: 'The duration must be positive' };
  }

  const totalDuration = isQuiz.questions.reduce((acc, curr) => acc + curr.duration, 0) + duration - isQuestion.duration;
  if (totalDuration > 180) {
    return { error: 'The total duration of the quiz will exceed 3 minutes' };
  }

  if (points <= 0 || points > 10) {
    return { error: 'The points awarded for this question are less than 1 or greater than 10' };
  }

  for (const it of answers) {
    if (it.answer.length < 1 || it.answer.length > 30) {
      return { error: 'the length of the answer is either less than 1 or greater than 30' };
    }
  }

  const isDuplicateAnswer = checkDuplicateAnswers(answers);
  if (isDuplicateAnswer) {
    return { error: 'Duplicate answer strings within the same question' };
  }

  const hasCorrectAnswer = answers.some(answer => answer.correct);
  if (!hasCorrectAnswer) {
    return { error: 'At least one correct answer is required' };
  }

  // If thumbnail argument is passed in, perform validation checks related to thumbnail
  if (thumbnail !== undefined) {
    if (thumbnail === '') {
      return { error: 'the thumbnail is an empty string' };
    }

    const validImgUrl = validator.isURL(thumbnail, { protocols: ['http', 'https'], require_tld: true });
    if (validImgUrl === false) {
      return { error: 'Invalid Image URL' };
    }

    if (!thumbnail.endsWith('.png') && !thumbnail.endsWith('.jpg')) {
      return { error: 'Image URL must be of type png or jpg' };
    }
  }

  // if we have reached this point, we have passed all error checking.
  // we should update the specified quiz question, fix total duration
  // and update each changed field.
  const questionIndex = data.quizzes[quizIndex].questions.indexOf(isQuestion);
  data.quizzes[quizIndex].timeLastEdited = Math.floor(Date.now() / 1000);
  data.quizzes[quizIndex].totalDuration -= data.quizzes[quizIndex].questions[questionIndex].duration;
  data.quizzes[quizIndex].totalDuration += duration;

  data.quizzes[quizIndex].questions[questionIndex].question = question;
  data.quizzes[quizIndex].questions[questionIndex].duration = duration;
  data.quizzes[quizIndex].questions[questionIndex].points = points;
  data.quizzes[quizIndex].questions[questionIndex].thumbnailUrl = thumbnail;

  // set the colours for each ANSWER
  for (const it of answers) {
    it.colour = getRandomColor();
  }

  data.quizzes[quizIndex].questions[questionIndex].answers = answers;
  setData(data);
  return { };
}

/**
 * Views the quizzes in trash that are owned by the user
 *
 * @param {number} authUserId - Id of user viewing their deleted quizzes
 * @returns {
 * quizzes:
 *  [
 *      {quizId: number, name: string,}
 *  ]
 * }
 *
 */
function adminQuizViewTrash(authUserId: number): { quizzes: QuizListItem[]} {
  const data = getData();
  const trashList: { quizzes: QuizListItem[] } = { quizzes: [] };

  for (const quiz of data.trash) {
    if (quiz.authUserId === authUserId) {
      trashList.quizzes.push({
        quizId: quiz.quizId,
        name: quiz.name
      });
    }
  }

  return trashList;
}

/**
 * Allows a user to create a quiz based on information they give the program.
 * Keeps track of the users Id and name in order to identify who created the
 * quiz
 *
 * @param {number} authUserId - Id of user making modifications
 * @param {number} quizId - Id of the quiz the question is in
 * @param {number} questionId - Id of the question that is being duplicated
 * @returns {
*   {
  *     newQuestionId: number,
  *   }
  * } - a unique integer to direct us to any given quiz.
  */
function adminQuizQuestionDuplicate(authUserId: number, quizId: number, questionId: number): {newQuestionId: number } | ErrorMsg {
  const data = getData();
  const isQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!isQuiz) {
    return { error: 'QuizId does not refer to a valid quiz' };
  }
  // Finds index of existing quiz
  const quizIndex = data.quizzes.indexOf(isQuiz);
  const isOwned = data.quizzes.find(quiz => quiz.quizId === quizId && quiz.authUserId === authUserId);
  // Uses the found index to check if question id exists in said quiz
  const isQuestion = data.quizzes[quizIndex].questions.find(question => question.questionId === questionId);
  // Creates a duplicated Question object using the found question.
  const duplicatedQuestion = { ...isQuestion };
  // Generates a new id in the same method the original was created.
  const newQuestionId = parseInt(String(Math.floor(Math.random() * Math.pow(10, 6))).padStart(6, '0'));
  if (!isOwned) {
    return { error: 'The user does not own the quiz' };
  }
  if (!isQuestion) {
    return { error: 'Question Id does not refer to a valid question in this quiz' };
  }
  // Change the duplicated objects id to be unique.
  duplicatedQuestion.questionId = newQuestionId;
  // Find Index of original question
  const questionIndex = isQuiz.questions.findIndex(question => question.questionId === questionId);
  // Edit time last edited of original question
  data.quizzes[quizIndex].timeLastEdited = Math.floor(Date.now() / 1000);
  // Pushed duplicated question in index ahead of original
  data.quizzes[quizIndex].questions.splice(questionIndex + 1, 0, duplicatedQuestion);
  setData(data);
  return { newQuestionId: newQuestionId };
}
/**
 * Restore a particular quiz from the trash back to an active quiz
 *
 * @param {number} authUserId - ID of currently authenticated user
 * @param {number} quizId - ID of quiz being restored
 *
 * @returns {
*   {}
* } - an empty object
*/
function adminQuizRestore(authUserId: number, quizId: number): Record<string, never> | ErrorMsg {
  const data = getData();

  // Quiz ID does not refer to a valid quiz
  const activeQuiz = data.quizzes.find(element => element.quizId === quizId);
  const trashQuiz = data.trash.find(element => element.quizId === quizId);

  // Quiz ID refers to a quiz that is not currently in the trash
  if (activeQuiz) {
    return { error: 'Quiz ID refers to a quiz that is not currently in the trash' };
  }

  // Quiz ID does not refer to a valid quiz
  if (!trashQuiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Quiz ID does not refer to a quiz that this user owns
  if (authUserId !== trashQuiz.authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // Restore the quiz
  data.quizzes.push(trashQuiz);
  data.trash = data.trash.filter(quiz => quiz.quizId !== quizId);

  setData(data);

  return {};
}

/**
 * Moves a question from one position to another in a quiz.
 *
 * @param {number} authUserId - the ID of the user who owns the quiz
 * @param {number} quizId - the ID of the quiz being edited
 * @param {number} questionId - the ID of the question being moved
 * @param {number} newPosition - the new position of the question
 *
 * @returns {} - the empty object
 */
function adminQuizQuestionMove (authUserId: number, quizId: number, questionId: number, newPosition: number): Record<string, never> | ErrorMsg {
  const data = getData();
  const isQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!isQuiz) {
    return { error: 'QuizId does not refer to a valid quiz' };
  }
  const quizIndex = data.quizzes.indexOf(isQuiz);
  // Find Index of quiz
  const isOwned = data.quizzes.find(quiz => quiz.quizId === quizId && quiz.authUserId === authUserId);
  // Find questionm in said quiz as well as find its index.
  const isQuestion = data.quizzes[quizIndex].questions.find(question => question.questionId === questionId);
  const questionIndex = data.quizzes[quizIndex].questions.findIndex(question => question.questionId === questionId);
  if (!isOwned) {
    return { error: 'The user does not own the quiz' };
  }
  if (!isQuestion) {
    return { error: 'Question Id does not refer to a valid question in this quiz' };
  }
  if (newPosition < 0 || newPosition > data.quizzes[quizIndex].questions.length - 1) {
    return { error: 'This position is not valid' };
  }
  if (newPosition === questionIndex) {
    return { error: 'This index is the same as the current location' };
  }
  // Removes the original question that existed
  data.quizzes[quizIndex].questions.splice(1, questionIndex);
  data.quizzes[quizIndex].timeLastEdited = Math.floor(Date.now() / 1000);
  // Adds a copy of the object into the new position specified.
  data.quizzes[quizIndex].questions.splice(newPosition, 0, isQuestion);
  return {};
}

/**
 * Deletes a question from a particular quiz, permanently.
 *
 * @param {number} authUserId - the ID of the user who owns the quiz
 * @param {numbe} quizId - the ID of the quiz being edited
 * @param {number} questionId - the ID of the question being deleted
 *
 * @returns {} - the empty object.
 */
function adminQuestionDelete(authUserId: number, quizId: number, questionId: number) {
  const data = getData();
  const isQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const isOwned = data.quizzes.find(quiz => quiz.quizId === quizId && quiz.authUserId === authUserId);

  // If quizId dosen't exist throw error
  if (!isQuiz) {
    return { error: 'The quiz id is not valid' };
  }
  // If quiz object dosen't contain correct userId return error
  if (!isOwned) {
    return { error: 'The user does not own the quiz' };
  }

  // if we have reached this point, the quiz is valid
  const quizIndex = data.quizzes.indexOf(isQuiz);
  const isQuestion = data.quizzes[quizIndex].questions.find(question => question.questionId === questionId);

  if (!isQuestion) {
    return { error: 'Question Id does not refer to a valid question in this quiz' };
  }

  // if we have reached this point, the question is valid as well, we splice out the specified question
  const questionIndex = isQuiz.questions.findIndex(question => question.questionId === questionId);

  // Remove the question from the quiz's questionsAndAnswers array
  data.quizzes[quizIndex].questions.splice(questionIndex, 1);

  return {}; // Return an empty object to indicate success
}

/**
 * Creates a quiz session
 *
 * @param {number} authUserId - ID of currently authenticated user
 * @param {number} quizId - ID of quiz that the session is for
 * @param {number} autoStartNum - number of people to autostart the quiz once that number of people join
 * @returns {
*   { sessionId: number }
* } - a unique identifier for the session
*/
function adminQuizSessionStart(authUserId: number, quizId: number, autoStartNum: number) {
  const data = getData();

  // Quiz ID does not refer to a valid quiz
  const quiz = data.quizzes.find(element => element.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Quiz ID does not refer to a quiz that this user owns
  if (authUserId !== quiz.authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // autoStartNum greater than 50
  if (autoStartNum > 50) {
    return { error: 'autoStartNum is a number greater than 50' };
  }

  // More than 10 session not in end state exist
  const sessionCount = data.quizSessions.filter(
    session => session.metadata.quizId === quizId && session.state !== QuizState.End
  ).length;
  if (sessionCount >= 10) {
    return { error: 'A maximum of 10 sessions that are not in END state currently exist' };
  }

  // Quiz does not have any questions
  if (quiz.numQuestions === 0) {
    return { error: 'The quiz does not have any questions in it' };
  }

  // No errors, so actually create the session
  const sessionId = generateNumericalId();

  data.quizSessions.push({
    sessionId: sessionId,
    state: QuizState.Lobby,
    atQuestion: 0,
    autoStartNum: autoStartNum,
    players: [],
    metadata: Object.assign({}, quiz), // copy the quiz
    questionTimerStarted: 0,
  });
  // Create timers for the quizSession
  createTimers(sessionId);

  setData(data);
  return { sessionId: sessionId };
}

function cancelTimers(quizSessionId: number) {
  const timers = getTimers(quizSessionId);

  if (timers.countdownTimer) {
    clearTimeout(timers.countdownTimer);
  }
  if (timers.questionTimer) {
    clearTimeout(timers.questionTimer);
  }
}

/**
 * Update the state of a particular session by sending an action command
 *
 * @param {number} authUserId - ID of currently authenticated user
 * @param {number} quizId - ID of quiz that the session is for
 * @param {number} quizSessionId - ID of quiz session
 * @param {QuizSessionAction} action - action command
 * @returns {
*   {}
* } - an empty object
*/
function adminQuizSessionUpdate(authUserId: number, quizId: number, quizSessionId: number, action: QuizSessionAction) {
  const data = getData();
  const timers = getTimers(quizSessionId);

  // Quiz ID does not refer to a valid quiz
  const quiz = data.quizzes.find(element => element.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Quiz ID does not refer to a quiz that this user owns
  if (authUserId !== quiz.authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // Session Id does not refer to a valid session (spec has typo)
  const quizSession = data.quizSessions.find(element => element.sessionId === quizSessionId);
  if (!quizSession) {
    return { error: 'Session Id does not refer to a valid session' };
  }

  // Action provided is not a valid Action enum
  if (!Object.values(QuizSessionAction).includes(action)) {
    return { error: 'Action provided is not a valid Action enum' };
  }

  // Check that the given action is valid for the current state
  const state = quizSession.state;

  const actionMap: { [key in QuizState]: { action: string, newState: string }[] } = {
    [QuizState.Lobby]: [{ action: 'NEXT_QUESTION', newState: 'QUESTION_COUNTDOWN' }],
    [QuizState.QuestionCountdown]: [{ action: 'NEXT_QUESTION', newState: 'ANSWER_SHOW' }],
    [QuizState.QuestionOpen]: [{ action: 'GO_TO_ANSWER', newState: 'ANSWER_SHOW' }],
    [QuizState.QuestionClose]: [
      { action: 'NEXT_QUESTION', newState: 'QUESTION_COUNTDOWN' },
      { action: 'GO_TO_ANSWER', newState: 'ANSWER_SHOW' },
      { action: 'GO_TO_FINAL_RESULTS', newState: 'FINAL_RESULTS' }
    ],
    [QuizState.AnswerShow]: [
      { action: 'NEXT_QUESTION', newState: 'QUESTION_COUNTDOWN' },
      { action: 'GO_TO_FINAL_RESULTS', newState: 'FINAL_RESULTS' }
    ],
    [QuizState.FinalResults]: [],
    [QuizState.End]: []
  };

  const matchingAction = actionMap[state].find((obj: { action: string; newState: string }) => obj.action === action);
  if (matchingAction) {
    quizSession.state = matchingAction.newState as QuizState;

    // Update current question
    if ([QuizState.Lobby, QuizState.FinalResults, QuizState.End].includes(quizSession.state)) {
      quizSession.atQuestion = 0;
    } else if (action === QuizSessionAction.NextQuestion) {
      quizSession.atQuestion++;
    }

    cancelTimers(quizSessionId);
    // Set timers if required
    if (quizSession.state === QuizState.QuestionCountdown) {
      timers.countdownTimer = setTimeout(() => {
        quizSession.state = QuizState.QuestionOpen;

        quizSession.questionTimerStarted = Math.floor(Date.now() / 1000);

        const questionDuration = quizSession.metadata.questions[quizSession.atQuestion - 1].duration;
        timers.questionTimer = setTimeout(() => {
          quizSession.state = QuizState.QuestionClose;
        }, questionDuration * 1000); // convert to milliseconds
      }, 100); // hardcoded to 0.1s for assignment to make testing easy
    }
  } else if (action === QuizSessionAction.End && state !== QuizState.End) {
    // END action is always valid unless already at end
    cancelTimers(quizSessionId);
    quizSession.state = QuizState.End;
  } else {
    return { error: 'Action enum cannot be applied in the current state' };
  }

  setData(data);
  return {};
}

/**
 * Retrieves active and inactive session ids (sorted in ascending order) for a quiz
 *
 * @param {number} authUserId - ID of currently authenticated user
 * @param {number} quizId - ID of quiz that the session is for
 * @returns {
 *   {
 *     activeSessions: number[],
 *     inactiveSessions: number[]
 *   }
 * } - an object containing active and inactive sessions
 */
function adminQuizViewSessions(authUserId: number, quizId: number): { activeSessions: number[], inactiveSessions: number[] } {
  const data = getData();

  // Get the active and inactive sessions
  const activeSessions = data.quizSessions.filter(
    (session) => session.metadata.quizId === quizId && session.state !== QuizState.End
  );
  const inactiveSessions = data.quizSessions.filter(
    (session) => session.metadata.quizId === quizId && session.state === QuizState.End
  );

  // Get the list of active/inactive session IDs
  let activeSessionIds = activeSessions.map((session) => session.sessionId);
  let inactiveSessionIds = inactiveSessions.map((session) => session.sessionId);

  // Sort them in ascending order
  activeSessionIds = activeSessionIds.sort((a, b) => a - b);
  inactiveSessionIds = inactiveSessionIds.sort((a, b) => a - b);

  return {
    activeSessions: activeSessionIds,
    inactiveSessions: inactiveSessionIds
  };
}

function adminQuizSessionStatus(authUserId: number, quizId: number, quizSessionId: number) {
  const data = getData();
  const playerArray = [];
  // Quiz ID does not refer to a valid quiz
  const quiz = data.quizzes.find(element => element.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Quiz ID does not refer to a quiz that this user owns
  if (authUserId !== quiz.authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // Session Id does not refer to a valid session (spec has typo)
  const quizSession = data.quizSessions.find(element => element.sessionId === quizSessionId);
  if (!quizSession) {
    return { error: 'Session Id does not refer to a valid session' };
  }

  for (const it of quizSession.players) {
    playerArray.push(it.name);
  }

  return {
    state: quizSession.state,
    atQuestion: quizSession.atQuestion,
    players: playerArray,
    metadata: quizSession.metadata
  };
}

/**
 * Updates the thumbnail property of a quiz (when quizzes are created, their
 * thumbnail key is set to the empty string)
 *
 * @param {number} authUserId - the ID of the user who owns the quiz
 * @param {number} quizId - the ID of the quiz to be edited
 * @param {string} imgUrl - the URL of the image to be used as the thumbnail
 *
 * @returns {} - the empty object, but if the thumbnail is valid, it is pushed
 * into the quiz object and should be reflected in the frontend.
 */
function updateQuizThumbnail(authUserId: number, quizId: number, imgUrl: string) {
  const data = getData();
  const findQuiz = data.quizzes.find(element => element.quizId === quizId);
  if (!findQuiz) {
    return { error: 'Invalid quiz' };
  }

  const ownQuiz = data.quizzes.find(element => element.quizId === quizId && element.authUserId === authUserId);
  if (!ownQuiz) {
    return { error: 'Quiz is not owned by user' };
  }

  const validImgUrl = validator.isURL(imgUrl, { protocols: ['http', 'https'], require_tld: true });
  if (validImgUrl === false) {
    return { error: 'Invalid Image URL' };
  }

  if (!imgUrl.endsWith('.png') && !imgUrl.endsWith('.jpg')) {
    return { error: 'Image URL must be of type png or jpg' };
  }

  const folderName = 'static';
  if (!fs.existsSync(`./${folderName}`)) {
    fs.mkdir(folderName, (err) => {
      if (err) {
        return { error: 'Folder that contains image URL could not be created' };
      }
    });
  }

  const fileName = String(Math.floor(Math.random() * Math.pow(10, 10))).padStart(10, '0');
  const port = config.port;
  const url = config.url;

  const res = request(
    'GET',
    imgUrl
  );
  const body = res.getBody();

  if (imgUrl.endsWith('png')) {
    fs.writeFileSync(`static/image_${fileName}.png`, body, { flag: 'w' });
    findQuiz.thumbnailUrl = `${url}:${port}/static/image_${fileName}.png`;
    setData(data);
  } else {
    fs.writeFileSync(`static/image_${fileName}.jpg`, body, { flag: 'w' });
    findQuiz.thumbnailUrl = `${url}:${port}/static/image_${fileName}.jpg`;
    setData(data);
  }
  return {};
}

/**
 * View the final quiz session results of every player
 *
 * @param {number} authUserId - Id of User viewing the results
 * @param {number} quizId - Id of quiz that was completed
 * @param {number} quizSessionId - Id of quiz session
 * @returns {
*   {
  *     FinalQuizResults
  *   }
  * } - the final quiz session results of the finished quiz
  */
function adminQuizSessionResults(authUserId: number, quizId: number, quizSessionId: number) {
  const data = getData();
  // Quiz ID does not refer to a valid quiz
  const quiz = data.quizzes.find(element => element.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Quiz ID does not refer to a quiz that this user owns
  if (authUserId !== quiz.authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // Session Id does not refer to a valid session (spec has typo)
  const quizSession = data.quizSessions.find(element => element.sessionId === quizSessionId);
  if (!quizSession) {
    return { error: 'Session Id does not refer to a valid session' };
  }

  if (quizSession.state !== QuizState.FinalResults) {
    return { error: 'the quiz is not in the right state hi hi hi' };
  }

  const playersCopy = [...quizSession.players];
  const playersNameScore = playersCopy.map((player) => ({
    name: player.name,
    score: player.totalScore ?? 0
  }));

  playersNameScore.sort((a, b) => b.score - a.score);

  const results: FinalQuizResults = {
    usersRankedByScore: playersNameScore,
    questionResults: []
  };

  for (const question of quizSession.metadata.questions) {
    const questionResult: QuestionResults = {
      questionId: question.questionId,
      questionCorrectBreakdown: [],
      averageAnswerTime: question.averageAnswerTime,
      percentCorrect: question.percentCorrect
    };

    for (const answer of question.answers) {
      if (answer.correct === true) {
        const answerCorrectBreakdown: QuestionCorrectBreakdown = {
          answerId: answer.answerId,
          playersCorrect: question.playersCorrect
        };
        questionResult.questionCorrectBreakdown.push(answerCorrectBreakdown);
      }
    }

    results.questionResults.push(questionResult);
  }

  return results;
}

/**
 * Returns a CSV file of the the final quiz session results of every player
 *
 * @param {number} authUserId - Id of User viewing the results
 * @param {number} quizId - Id of quiz that was completed
 * @param {number} quizSessionId - Id of quiz session
 * @returns {
*   {
  *     url: string
  *   }
  * } - the url link for the CSV file
  */
function adminQuizSessionResultsCSV(authUserId: number, quizId: number, quizSessionId: number) {
  const data = getData();
  // Quiz ID does not refer to a valid quiz
  const quiz = data.quizzes.find(element => element.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Quiz ID does not refer to a quiz that this user owns
  if (authUserId !== quiz.authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // Session Id does not refer to a valid session (spec has typo)
  const quizSession = data.quizSessions.find(element => element.sessionId === quizSessionId);
  if (!quizSession) {
    return { error: 'Session Id does not refer to a valid session' };
  }

  if (quizSession.state !== QuizState.FinalResults) {
    return { error: 'the quiz is not in the right state' };
  }

  let csv = 'Player,';
  let position = 1;
  // This is only used to loop through the questions array without having a typescript error
  for (let i = 0; i < quizSession.metadata.questions.length; i++) {
    csv += `question${position}score,question${position}rank,`;
    position++;
  }
  csv = csv.slice(0, -1);
  csv += '\n';

  for (const question of quizSession.metadata.questions) {
    question.correctRankScore.sort((a, b) => b.score - a.score);
    let rank = 1;
    for (const index in question.correctRankScore) {
      if (Number(index) > 0 && question.correctRankScore[index].score !== question.correctRankScore[Number(index) - 1].score) {
        rank = Number(index) + 1;
      }
      question.correctRankScore[index].rank = rank;
    }
  }

  const players = [...quizSession.players];

  players.sort((a, b) => a.name.localeCompare(b.name));

  for (const player of players) {
    csv += `${player.name},`;
    for (const question of quizSession.metadata.questions) {
      const correctRankScore = question.correctRankScore.find(person => person.name === player.name);
      csv += `${correctRankScore.score},${correctRankScore.rank},`;
    }
    csv = csv.slice(0, -1);
    csv += '\n';
  }

  const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  return { url: dataUrl };
}

// Export functions to be used in test file
export {
  adminQuizCreate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizTransfer,
  adminQuizEmptyTrash,
  adminQuestionCreate,
  adminQuestionUpdate,
  adminQuizViewTrash,
  adminQuizRestore,
  adminQuizQuestionDuplicate,
  adminQuizQuestionMove,
  adminQuestionDelete,
  adminQuizSessionStart,
  adminQuizSessionUpdate,
  adminQuizViewSessions,
  adminQuizSessionStatus,
  updateQuizThumbnail,
  adminQuizSessionResults,
  adminQuizSessionResultsCSV
};
