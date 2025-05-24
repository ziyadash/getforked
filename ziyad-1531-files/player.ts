import { getData, setData } from './dataStore';
import { Answers, Player, QuizSession, QuizState, FinalQuizResults } from './interface';
import { QuestionResults, QuestionCorrectBreakdown, CorrectRankScore } from './interface';
import { generateNDigitString, generateRandomName, removeFromArray, removeFromCorrectRankScore, checkDuplicateAnswerIds } from './util';

/**
 * Allows a guest player to join a quiz session. If the name supplied is the
 * empty string, a randomly generated name with 5 letters and 3 numbers is used
 *
 * @param {string} name - the name of the user
 * @param {number} quizSessionId - the ID of the quiz session to join
 *
 * @returns {
 *  {
 *    playerId: number,
 *  }
 * } - an object containing the new player's ID.
 */
function playerJoinQuizSession(name: string, quizSessionId: number) {
  const data = getData();

  // check if quiz corresponding to quizSessionId is not in LOBBY
  const quizSession = data.quizSessions.find(quiz => quiz.sessionId === quizSessionId);

  if (quizSession.state !== QuizState.Lobby) {
    return { error: 'session is not in LOBBY state' };
  }

  // the quiz session exists, get its index
  const quizSessionIndex = data.quizSessions.indexOf(quizSession);

  // check if name exists already
  const nameExists = data.quizSessions[quizSessionIndex].players.find(it => it.name === name);
  if (nameExists) {
    return { error: 'name is not unique' };
  }

  // check if name is empty string
  if (name.length === 0) {
    name = generateRandomName();
  }

  // set up the object and push it into dataStore.
  const playerId = generateNDigitString(4);
  const joinObject: Player = { playerId: playerId, name: name, answers: [], messages: [] };

  data.quizSessions[quizSessionIndex].players.push(joinObject);
  setData(data);

  return { playerId: playerId };
}

/**
 * Get the status of a guest player that has already joined a session.
 *
 * @param {string} playerId - the ID of the player
 *
 * @returns {
 *  {
 *    state: number,
 *    numQuestions: number,
 *    atQuestion: number,
 *  }
 * } - an object containing the state of the quiz, the number of questions in it,
 * and the question the quiz is currently up to
 */
function playerStatus(playerId: number) {
  const data = getData();

  // search for a quiz that contains the player with the given playerId
  let quizSession;
  let player;
  for (const it1 of data.quizSessions) {
    for (const it2 of it1.players) {
      if (it2.playerId === playerId) {
        quizSession = it1;
        player = it2;
        break;
      }
    }
  }

  if (!player) {
    return { error: 'the playerId is invalid' };
  }

  const returnObject = {
    state: quizSession.state,
    numQuestions: quizSession.metadata.numQuestions,
    atQuestion: quizSession.atQuestion,
  };

  return returnObject;
}

/**
 * Allows a player to submit a set of answsers for a particular question in
 * a quiz when a quiz session is in appropriate state. Also does some work related
 * to calculating statistics for final quiz results and question results
 *
 * @param {number} playerId - the ID of the player
 * @param {number} questionPosition - the position of this question in the quiz
 * @param {Answers} answerIds - the IDs of the answers the player has chosen
 *
 * @returns { } - the empty object. However, we push a lot of data into the
 * datastore regarding the question submission.
 */
function playerSubmissionOfAnswers(playerId: number, questionPosition: number, answerIds: number[]) {
  const data = getData();

  // search for a quiz that contains the player with the given playerId
  let quizSession;
  let player;
  for (const it1 of data.quizSessions) {
    for (const it2 of it1.players) {
      if (it2.playerId === playerId) {
        quizSession = it1;
        player = it2;
        break;
      }
    }
  }

  if (!player) {
    return { error: 'the playerId is invalid' };
  }

  const numQuestions = quizSession.metadata.questions.length;
  if (questionPosition > numQuestions || questionPosition < 0) {
    return { error: 'the question position is invalid' };
  }

  if (quizSession.state !== QuizState.QuestionOpen) {
    return { error: 'the quiz is not in the right state' };
  }

  const atQuestion = quizSession.atQuestion;
  if (questionPosition > atQuestion) {
    return { error: 'the quiz is not yet up to this question' };
  }

  for (const answerId of answerIds) {
    let isValidAnswerId = false;

    for (const question of quizSession.metadata.questions) {
      if (question.answers.some(answer => answer.answerId === answerId)) {
        isValidAnswerId = true;
        break;
      }
    }

    if (!isValidAnswerId) {
      return { error: 'Invalid answerId provided' };
    }
  }

  const isDuplicateAnswerIds = checkDuplicateAnswerIds(answerIds);
  if (isDuplicateAnswerIds) {
    return { error: 'duplicate answerIds provided' };
  }

  if (answerIds.length === 0) {
    // we should still push an empty answers object into the array so that
    // the indexes remain correct
    const emptyAnswers: Answers[] = [];
    player.answers.push(emptyAnswers);
    return { error: 'less than 1 answerId was submitted' };
  }

  // Checks if answer already exists. If so delete the current items in the array
  // and replace them.
  if (player.answers[questionPosition - 1]) {
    quizSession.metadata.questions[questionPosition - 1].totalAnswertime -= player.timeTakenForOneQuestion;
    if (player.ifCorrect === true) {
      quizSession.metadata.questions[questionPosition - 1].totalUsersAnswering -= 1;
      removeFromArray(quizSession.metadata.questions[questionPosition - 1].playersCorrect, player.name);
    }
    player.answers[questionPosition - 1] = [];
    player.ifCorrect = false;
    player.timeTakenForOneQuestion = 0;
    player.totalScore -= player.scoreForOneQuestion;
    if (!player.totalScore) {
      player.totalScore = 0;
    }
    removeFromCorrectRankScore(quizSession.metadata.questions[questionPosition - 1].correctRankScore, player.name);
  }

  // Update data if suitable
  const timeSubmitted: number = Math.floor(Date.now() / 1000);
  if (!quizSession.metadata.questions[questionPosition - 1].totalAnswertime) {
    quizSession.metadata.questions[questionPosition - 1].totalAnswertime = timeSubmitted - quizSession.questionTimerStarted;
  } else {
    quizSession.metadata.questions[questionPosition - 1].totalAnswertime += timeSubmitted - quizSession.questionTimerStarted;
  }

  player.timeTakenForOneQuestion = timeSubmitted - quizSession.questionTimerStarted;

  if (!quizSession.metadata.questions[questionPosition - 1].totalUsersAnswering) {
    quizSession.metadata.questions[questionPosition - 1].totalUsersAnswering = 1;
  } else {
    quizSession.metadata.questions[questionPosition - 1].totalUsersAnswering += 1;
  }

  quizSession.metadata.questions[questionPosition - 1].averageAnswerTime = Math.ceil(quizSession.metadata.questions[questionPosition - 1].totalAnswertime / quizSession.metadata.questions[questionPosition - 1].totalUsersAnswering);

  // Find the array of answers for the current question position

  // player.answers[questionPosition - 1].length = 0;

  if (!player.answers[questionPosition - 1]) {
    player.answers[questionPosition - 1] = [];
  }

  // Push the new answers into the array
  for (const answerId of answerIds) {
    const matchingAnswer = quizSession.metadata.questions[questionPosition - 1].answers.find(answer => answer.answerId === answerId);
    if (matchingAnswer) {
      player.answers[questionPosition - 1].push(matchingAnswer);
    }
  }

  let correctOptions = 0;
  let correctAnswers = 0;

  for (const answer of quizSession.metadata.questions[questionPosition - 1].answers) {
    if (answer.correct === true) {
      correctOptions++;
    }
  }

  for (const answer of player.answers[questionPosition - 1]) {
    if (answer.correct === true) {
      correctAnswers++;
    }
  }

  // Update if correct Answer
  if (correctOptions === correctAnswers) {
    if (!quizSession.metadata.questions[questionPosition - 1].totalUsersCorrect) {
      quizSession.metadata.questions[questionPosition - 1].totalUsersCorrect = 1;
    } else {
      quizSession.metadata.questions[questionPosition - 1].totalUsersCorrect += 1;
    }
    // Update array of correct players
    if (!quizSession.metadata.questions[questionPosition - 1].playersCorrect) {
      quizSession.metadata.questions[questionPosition - 1].playersCorrect = [player.name];
    } else {
      quizSession.metadata.questions[questionPosition - 1].playersCorrect.push(player.name);
    }
    player.ifCorrect = true;
    // Update the total score of a player
    if (!player.totalScore) {
      player.totalScore = quizSession.metadata.questions[questionPosition - 1].points * (1 / quizSession.metadata.questions[questionPosition - 1].playersCorrect.length);
    } else {
      player.totalScore += quizSession.metadata.questions[questionPosition - 1].points * (1 / quizSession.metadata.questions[questionPosition - 1].playersCorrect.length);
    }
    player.scoreForOneQuestion = quizSession.metadata.questions[questionPosition - 1].points * (1 / quizSession.metadata.questions[questionPosition - 1].playersCorrect.length);
    const correctRankScore: CorrectRankScore = {
      name: player.name,
      rank: quizSession.metadata.questions[questionPosition - 1].totalUsersCorrect,
      score: player.scoreForOneQuestion
    };
    if (!quizSession.metadata.questions[questionPosition - 1].correctRankScore) {
      quizSession.metadata.questions[questionPosition - 1].correctRankScore = [];
      quizSession.metadata.questions[questionPosition - 1].correctRankScore.push(correctRankScore);
    } else {
      quizSession.metadata.questions[questionPosition - 1].correctRankScore.push(correctRankScore);
    }
  } else {
    player.scoreForOneQuestion = 0;
    if (!quizSession.metadata.questions[questionPosition - 1].totalUsersCorrect) {
      quizSession.metadata.questions[questionPosition - 1].totalUsersCorrect = 0;
    }
    if (!quizSession.metadata.questions[questionPosition - 1].playersCorrect) {
      quizSession.metadata.questions[questionPosition - 1].playersCorrect = [];
    }
    const correctRankScore: CorrectRankScore = {
      name: player.name,
      rank: quizSession.metadata.questions[questionPosition - 1].totalUsersAnswering,
      score: 0
    };
    if (!quizSession.metadata.questions[questionPosition - 1].correctRankScore) {
      quizSession.metadata.questions[questionPosition - 1].correctRankScore = [];
      quizSession.metadata.questions[questionPosition - 1].correctRankScore.push(correctRankScore);
    } else {
      quizSession.metadata.questions[questionPosition - 1].correctRankScore.push(correctRankScore);
    }
  }

  quizSession.metadata.questions[questionPosition - 1].percentCorrect = Math.floor((quizSession.metadata.questions[questionPosition - 1].totalUsersCorrect / quizSession.metadata.questions[questionPosition - 1].totalUsersAnswering) * 100);

  return { };
}

/**
 * Returns some information about the current question.
 *
 * @param {number} playerId - the ID of the plaer
 * @param {number} questionPosition - the position of the question in the quiz
 *
 * @returns {
 *  questionId: number,
 *  question: string,
 *  duration: number,
 *  thumbnailUrl: number,
 *  points: number,
 *  answers: Answers,
 *
 * }
 */
function playerQuestionInfo(playerId: number, questionPosition: number) {
  const data = getData();

  // search for a quiz that contains the player with the given playerId
  let quizSession;
  let player;
  for (const it1 of data.quizSessions) {
    for (const it2 of it1.players) {
      if (it2.playerId === playerId) {
        quizSession = it1;
        player = it2;
        break;
      }
    }
  }

  if (!player) {
    return { error: 'the playerId is invalid' };
  }

  // Checks if possible for a question to exist in given position
  const numQuestions = quizSession.metadata.questions.length;
  if (questionPosition > numQuestions) {
    return { error: 'the question position is invalid' };
  }

  // Checks if quiz has gone past the question or has yet to approach it
  const atQuestion = quizSession.atQuestion;
  if (questionPosition > atQuestion) {
    return { error: 'the quiz is not yet up to this question' };
  }

  // Check the state of the session to see if it is at an appropriate time
  if (quizSession.state === 'LOBBY' || quizSession.state === 'END') {
    return { error: 'quiz is in incorrect state' };
  }

  // Create array to store answer Info for the return value
  const answersArr = [];
  const questionInfo = quizSession.metadata.questions;
  const questionIndex = questionPosition - 1; // Adjust to 0-based index

  // Extract answerId and answer fields for the specified question position
  for (const answer of questionInfo[questionIndex].answers) {
    answersArr.push({
      answerId: answer.answerId,
      answer: answer.answer,
      colour: answer.colour
    });
  }

  return {
    questionId: questionInfo[questionIndex].questionId,
    question: questionInfo[questionIndex].question,
    duration: questionInfo[questionIndex].duration,
    thumbnailUrl: questionInfo[questionIndex].thumbnailUrl,
    points: questionInfo[questionIndex].points,
    answers: answersArr
  };
}

function playerResultsInfo(playerId: number, questionPosition: number) {
  const data = getData();

  // search for a quiz that contains the player with the given playerId
  let quizSession;
  let player;
  for (const it1 of data.quizSessions) {
    for (const it2 of it1.players) {
      if (it2.playerId === playerId) {
        quizSession = it1;
        player = it2;
        break;
      }
    }
  }

  if (!player) {
    return { error: 'the playerId is invalid' };
  }

  const numQuestions = quizSession.metadata.questions.length;
  if (questionPosition > numQuestions) {
    return { error: 'the question position is invalid' };
  }

  const atQuestion = quizSession.atQuestion;
  if (questionPosition > atQuestion) {
    return { error: 'the quiz is not yet up to this question' };
  }

  if (quizSession.state !== 'ANSWER_SHOW') {
    return { error: 'quiz is in incorrect state' };
  }

  const questionIndex = questionPosition - 1;
  const questionInfo = quizSession.metadata.questions[questionIndex];
  const questionCorrectBreakdown = [];
  for (const answer of questionInfo.answers) {
    if (answer.correct === true) {
      const answerCorrectBreakdown: QuestionCorrectBreakdown = {
        answerId: answer.answerId,
        playersCorrect: questionInfo.playersCorrect
      };
      questionCorrectBreakdown.push(answerCorrectBreakdown);
    }
  }

  return {
    questionId: questionInfo.questionId,
    questionCorrectBreakdown: questionCorrectBreakdown,
    averageAnswerTime: questionInfo.averageAnswerTime,
    percentCorrect: questionInfo.percentCorrect
  };
}

/**
 * Allows players in a quiz session to send chat messages during a quiz session
 *
 * @param {number} playerId - the ID of the player
 * @param {string} message
 *
 * @returns {} - empty object
 */
function sendChatMessages(playerId: number, message: string) {
  const data = getData();
  let findPlayer: Player;
  let findQuizSession: QuizSession;
  // finds Session that the player is currently in
  for (const session of data.quizSessions) {
    findPlayer = session.players.find(element => element.playerId === playerId);
    if (findPlayer !== undefined) {
      findQuizSession = session;
      break;
    }
  }

  if (!findPlayer) {
    return { error: 'playerId does not exist' };
  }

  // Checks message length, too short or too long
  if (message.length < 1 || message.length > 100) {
    return { error: 'Message must be within 1 to to 100 characters' };
  }

  // Find the index of the appropriate session and then the appropriate player
  const findIndexSession = data.quizSessions.findIndex(element => element === findQuizSession);
  const findIndexPlayer = data.quizSessions[findIndexSession].players.findIndex(element => element === findPlayer);

  // Pushes all the required data into the message part
  data.quizSessions[findIndexSession].players[findIndexPlayer].messages.push({
    messageBody: message,
    playerId: playerId,
    playerName: findPlayer.name,
    timeSent: Math.floor(Date.now() / 1000)
  });

  setData(data);
  return ({});
}

/**
 * Returns all information that are sent in the same session as the player
 *
 * @param {number} playerId - the ID of the specific player
 *
 * @returns {
 *  messages: Messages[]
 * } - an object containing an array, which contains objects containing the
 * actual message, the playerId of who sent it, the player's name, and the time sent
 * in Unix time
 */
function displayChatMessages(playerId: number) {
  const data = getData();
  let findPlayer: Player;
  let findQuizSession: QuizSession;
  // Find quizsession from the player
  for (const session of data.quizSessions) {
    findPlayer = session.players.find(element => element.playerId === playerId);
    if (findPlayer !== undefined) {
      findQuizSession = session;
      break;
    }
  }

  if (!findPlayer) {
    return { error: 'playerId does not exist' };
  }

  // Find the message data
  const findIndexSession = data.quizSessions.findIndex(element => element === findQuizSession);
  const findIndexPlayer = data.quizSessions[findIndexSession].players.findIndex(element => element === findPlayer);

  // Return the message data we found
  return { messages: data.quizSessions[findIndexSession].players[findIndexPlayer].messages };
}

/**
 * View the final quiz session results of every player
 *
 * @param {number} playerId - Id of player viewing the quiz results
 * @returns {
 *   {
 *     FinalQuizResults
 *   }
 * } - the final quiz session results of the finished quiz
 */
function getPlayerResults(playerId: number) {
  const data = getData();

  // search for a quiz that contains the player with the given playerId
  let quizSession;
  let player;
  for (const it1 of data.quizSessions) {
    for (const it2 of it1.players) {
      if (it2.playerId === playerId) {
        quizSession = it1;
        player = it2;
        break;
      }
    }
  }

  if (!player) {
    return { error: 'the playerId is invalid' };
  }

  if (quizSession.state !== QuizState.FinalResults) {
    return { error: 'the quiz is not in the right state' };
  }

  // Makes a copy of players in the session and goes through the datastore
  // to find information needed for get Player results.
  const playersCopy = [...quizSession.players];
  const playersNameScore = playersCopy.map((player) => ({
    name: player.name,
    score: player.totalScore
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

export {
  playerJoinQuizSession,
  playerStatus,
  playerSubmissionOfAnswers,
  playerQuestionInfo,
  sendChatMessages,
  displayChatMessages,
  getPlayerResults,
  playerResultsInfo
};
