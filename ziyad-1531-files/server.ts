import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { clear } from './other';

// importing backbone functions and dataStore functions
import {
  adminQuizNameUpdate, adminQuizList, adminQuizCreate, adminQuizDescriptionUpdate,
  adminQuizEmptyTrash, adminQuizRemove, adminQuizInfo, adminQuestionCreate, adminQuizTransfer,
  adminQuizViewTrash, adminQuizQuestionDuplicate, adminQuizRestore, adminQuizQuestionMove,
  adminQuestionDelete, adminQuestionUpdate, adminQuizSessionStart, adminQuizSessionUpdate, adminQuizViewSessions, adminQuizSessionStatus,
  updateQuizThumbnail, adminQuizSessionResults, adminQuizSessionResultsCSV
} from './quiz';

import { adminAuthRegister, adminAuthLogin, adminUserDetails, updateUserDetails, updateUserPassword } from './auth';

import {
  playerJoinQuizSession, playerStatus, playerSubmissionOfAnswers, playerQuestionInfo, sendChatMessages,
  displayChatMessages, getPlayerResults, playerResultsInfo
} from './player';

import { getData, setData } from './dataStore';

// import util functions
import { generateSessionId, sessionIdValidator } from './util';

// import interfaces
import { LoginBody, RegisterBody, Tokens, QuizCreateRequest, QuestionCreateBody, QuestionUpdateBody, CustomError } from './interface';
import { PlayerJoinObject } from './interface';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for producing the docs that define the API
// const file = fs.readFileSync('./swagger.yaml', 'utf8');
// app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
// app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));
app.use('/static', express.static('static'));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors (print to terminal)
app.use(morgan('dev'));

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const body: RegisterBody = req.body;
  const registerResponse = adminAuthRegister(
    body.email, body.password, body.nameFirst, body.nameLast
  );

  if ('error' in registerResponse) {
    res.status(400).json(registerResponse);
  } else {
    // Create a session token for the new user
    const data = getData();
    const sessionId = generateSessionId();

    data.tokens.push({ sessionId: sessionId, authUserId: registerResponse.authUserId });
    setData(data);

    res.json({ token: sessionId });
  }
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const body: LoginBody = req.body;
  const loginResponse = adminAuthLogin(
    body.email, body.password
  );

  if ('error' in loginResponse) {
    res.status(400).json(loginResponse);
  } else {
    // Create a session token for the now authenticated user
    const data = getData();
    const sessionId = generateSessionId();

    data.tokens.push({ sessionId: sessionId, authUserId: loginResponse.authUserId });
    setData(data);

    res.json({ token: sessionId });
  }
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const sessionId = req.query.token as string;
  if (!sessionIdValidator(sessionId)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  // Retrieve the token from the data store based on the provided sessionId
  const data = getData();
  const token = data.tokens.find((t) => t.sessionId === sessionId);

  if (!token) {
    // If no token is found for the provided sessionId, return a 403 error
    res.status(403).json({ error: 'User is not logged in' });
    return;
  }

  // Call the adminUserDetails function to get user details
  const userDetails = adminUserDetails(token.authUserId);

  res.json(userDetails);
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const sessionId = req.header('token') as string;

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = getData().tokens.find((t) => t.sessionId === sessionId);

  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  // Call the adminUserDetails function to get user details
  const userDetails = adminUserDetails(token.authUserId);

  res.json(userDetails);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const sessionId = req.query.token as string;
  if (!sessionIdValidator(sessionId)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const token = getData().tokens.find((t) => t.sessionId === sessionId);

  if (!token) {
    res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session' });
    return;
  }

  const authUserId = token.authUserId;
  const quizList = adminQuizList(authUserId);

  res.json(quizList);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const sessionId = req.header('token');

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = getData().tokens.find((t) => t.sessionId === sessionId);

  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const authUserId = token.authUserId;
  const quizList = adminQuizList(authUserId);
  res.json(quizList);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const data = getData();
  const token = req.body.token;
  const name = req.body.name;
  const quizId = parseInt(req.params.quizid);
  if (!sessionIdValidator(token)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }
  const findToken = data.tokens.find((element) => element.sessionId === token);
  if (!findToken) {
    res.status(403).json({
      error:
      'Provided token is valid structure, but is not for a currently logged in session'
    });
    return;
  }

  const authUserId = findToken.authUserId;
  const bodyObj = adminQuizNameUpdate(authUserId, quizId, name);

  if ('error' in bodyObj) {
    res.status(400).json(bodyObj);
  } else {
    res.json(bodyObj);
  }
});

app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const data = getData();
  const token = req.header('token');
  const name = req.body.name;
  const quizId = parseInt(req.params.quizid);

  if (!sessionIdValidator(token)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const findToken = data.tokens.find((element) => element.sessionId === token);
  if (!findToken) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const authUserId = findToken.authUserId;
  const bodyObj = adminQuizNameUpdate(authUserId, quizId, name);

  if ('error' in bodyObj) {
    throw HTTPError(400, bodyObj.error);
  } else {
    res.json(bodyObj);
  }
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const body: QuizCreateRequest = req.body;
  // Get token through body as this is a post request
  const sessionToken = body.token;
  const data = getData();
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  // Checks token valid structure
  if (!sessionIdValidator(sessionToken)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }
  if (!tokenFound) {
    res.status(403).json({ error: 'User is not logged in' });
    return;
  }
  // Calls function and responds accordingly
  const QuizCreate = adminQuizCreate(tokenFound.authUserId, body.name, body.description);
  if ('error' in QuizCreate) {
    res.status(400).json(QuizCreate);
  } else {
    res.json(QuizCreate);
  }
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const body: QuizCreateRequest = req.body;
  // Get token through body as this is a post request
  const sessionToken = req.header('token');
  const data = getData();
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  // Checks token valid structure
  if (!sessionIdValidator(sessionToken)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  if (!tokenFound) {
    throw HTTPError(403, 'User is not logged in');
  }
  // Calls function and responds accordingly
  const QuizCreate = adminQuizCreate(tokenFound.authUserId, body.name, body.description);
  if ('error' in QuizCreate) {
    res.status(400).json(QuizCreate);
  } else {
    res.json(QuizCreate);
  }
});

app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  // Get quiz id through a param through the url.
  const sessionToken = req.query.token as string;
  // Get the token through a query as this is a delete request
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  // Check if token is valid structure
  if (!sessionIdValidator(sessionToken)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }
  if (!tokenFound) {
    res.status(403).json({ error: 'User is not logged in' });
    return;
  }
  // Runs function is quiz.ts and responds accordingly
  const QuizDelete = adminQuizRemove(tokenFound.authUserId, quizId);
  if ('error' in QuizDelete) {
    res.status(400).json(QuizDelete);
  } else {
    res.json(QuizDelete);
  }
});

app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  // Get quiz id through a param through the url.
  const token = req.header('token');
  // Get the token through a query as this is a delete request
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === token);
  // Check if token is valid structure
  if (!sessionIdValidator(token)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  if (!tokenFound) {
    throw HTTPError(403, 'User is not logged in');
  }
  // Runs function is quiz.ts and responds accordingly
  const QuizDelete = adminQuizRemove(tokenFound.authUserId, quizId);
  if ('error' in QuizDelete) {
    res.status(400).json(QuizDelete);
  } else {
    res.json(QuizDelete);
  }
});

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const data = getData();
  const token = req.body.token as string;
  const description = req.body.description;
  const quizId = parseInt(req.params.quizid);

  if (typeof token !== 'string' || token.length !== 10) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const findToken = data.tokens.find((element) => element.sessionId === token);
  if (!findToken) {
    res.status(403).json({
      error:
      'Provided token is valid structure, but is not for a currently logged in session'
    });
    return;
  }

  const authUserId = findToken.authUserId;
  const output = adminQuizDescriptionUpdate(authUserId, quizId, description);

  if ('error' in output) {
    res.status(400).json(output);
  } else {
    res.json(output);
  }
});

app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const sessionId = req.header('token');
  const description = req.body.description;
  const quizId = parseInt(req.params.quizid);

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = getData().tokens.find((t) => t.sessionId === sessionId);

  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const authUserId = token.authUserId;
  const output = adminQuizDescriptionUpdate(authUserId, quizId, description);

  if ('error' in output) {
    throw HTTPError(400, output.error);
  } else {
    res.json(output);
  }
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const data = getData();
  const token = req.body.token;

  if (!sessionIdValidator(token)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    res.status(400).json({ error: 'This token is for a user who has already logged out' });
    return;
  }

  const tokenIndex = data.tokens.findIndex(element => element.sessionId === token);
  data.tokens.splice(tokenIndex, 1);
  setData(data);

  res.json({});
});

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const data = getData();
  const token = req.header('token');

  if (!sessionIdValidator(token)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    throw HTTPError(400, 'This token is for a user who has already logged out');
  }

  const tokenIndex = data.tokens.findIndex(element => element.sessionId === token);
  data.tokens.splice(tokenIndex, 1);
  setData(data);

  res.json({});
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const data = getData();
  const token: string = req.query.token as string;

  if (!sessionIdValidator(token)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const findToken = data.tokens.find((element) => element.sessionId === token);
  if (!findToken) {
    res.status(403).json({
      error:
      'Provided token is valid structure, but is not for a currently logged in session'
    });
    return;
  }

  // Converts the quizIds string into a number array
  const quizIdsQuery: string = req.query.quizIds as string;
  const quizIds: number[] = JSON.parse(quizIdsQuery) as number[];

  const authUserId: number = findToken.authUserId;

  const output = adminQuizEmptyTrash(authUserId, quizIds);

  if ('error' in output) {
    res.status(400).json(output);
  } else {
    res.json(output);
  }
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const sessionId: string = req.header('token') as string;

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = getData().tokens.find((t) => t.sessionId === sessionId);

  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  // Converts the quizIds string into a number array
  const quizIdsQuery: string = req.query.quizIds as string;
  const quizIds: number[] = JSON.parse(quizIdsQuery) as number[];

  const authUserId: number = token.authUserId;

  const output = adminQuizEmptyTrash(authUserId, quizIds);

  if ('error' in output) {
    throw HTTPError(400, output.error);
  } else {
    res.json(output);
  }
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const body: QuestionCreateBody = req.body;

  // Retrieve the token from the request body
  const sessionId = body.token;
  const data = getData();
  const token: Tokens = data.tokens.find((t) => t.sessionId === sessionId);
  // validate sessionId
  if (!sessionIdValidator(sessionId)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  if (!token) {
    res.status(403).json({ error: 'User is not logged in' });
    return;
  }

  // Call the adminQuestionCreate function to create the question
  const result = adminQuestionCreate(
    token.authUserId,
    quizId,
    body.questionBody.question,
    body.questionBody.duration,
    body.questionBody.points,
    body.questionBody.answers
  );

  // there is one special error, if another user owns the quiz
  if ('error401' in result) {
    res.status(400).json({ error: 'Another user owns this quiz' });
    return;
  }

  if ('error' in result) {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
});

app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const body: QuestionCreateBody = req.body;

  // Retrieve the token from the request header
  const token = req.header('token');

  // Validate sessionId (token)
  if (!sessionIdValidator(token)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  // Find the token in the data
  const data = getData();
  const foundToken = data.tokens.find((t) => t.sessionId === token);

  if (!foundToken) {
    throw HTTPError(403, 'User is not logged in');
  }

  // Call the adminQuestionCreate function to create the question
  const result = adminQuestionCreate(
    foundToken.authUserId,
    quizId,
    body.questionBody.question,
    body.questionBody.duration,
    body.questionBody.points,
    body.questionBody.answers,
    body.questionBody.thumbnailUrl
  );

  // Check if another user owns the quiz
  if ('error401' in result) {
    throw HTTPError(400, 'Another user owns this quiz');
  }

  // Check for other errors
  if ('error' in result) {
    res.status(400).json(result);
  } else {
    res.status(200).json({ questionId: result.questionId });
  }
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const data = getData();
  const token = req.query.token as string;

  if (!sessionIdValidator(token)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const findToken = data.tokens.find((element) => element.sessionId === token);
  if (!findToken) {
    res.status(403).json({
      error:
      'Provided token is valid structure, but is not for a currently logged in session'
    });
    return;
  }

  const authUserId: number = findToken.authUserId;
  const trashList = adminQuizViewTrash(authUserId);

  res.json(trashList);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const sessionId = req.header('token');

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = getData().tokens.find((t) => t.sessionId === sessionId);

  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const authUserId = token.authUserId;
  const trashList = adminQuizViewTrash(authUserId);

  res.json(trashList);
});

app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const token = req.query.token as string;

  if (!sessionIdValidator(token)) {
    res.status(401).json({ error: 'Token is not of a valid structure' });
    return;
  }

  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    res.status(403).json({ error: 'This token is for a user who has already logged out' });
    return;
  }

  const authUserId = findToken.authUserId;
  const bodyObj = adminQuizInfo(authUserId, quizId);

  if ('error' in bodyObj) {
    res.status(400).json(bodyObj);
    return;
  }

  res.json(bodyObj);
});

app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const token = req.header('token');

  if (!sessionIdValidator(token)) {
    throw HTTPError(401, 'Token is not of a valid structure');
  }

  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    throw HTTPError(403, 'This token is for a user who has already logged out');
  }

  const authUserId = findToken.authUserId;
  const bodyObj = adminQuizInfo(authUserId, quizId);

  if ('error' in bodyObj) {
    throw HTTPError(400, bodyObj.error);
  }

  res.json(bodyObj);
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const sessionId = req.body.token;
  const email = req.body.userEmail;

  if (!sessionIdValidator(sessionId)) {
    res.status(401).json({ error: 'Token is not of a valid structure' });
    return;
  }

  const token = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session' });
    return;
  }

  const response = adminQuizTransfer(token.authUserId, email, quizId);
  if ('error' in response) {
    res.status(400).json(response);
  } else {
    res.json({});
  }
});

app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const sessionId = req.header('token');
  const email = req.body.userEmail;

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const response = adminQuizTransfer(token.authUserId, email, quizId);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  } else {
    res.json({});
  }
});

app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const sessionId = req.body.token;

  if (!sessionIdValidator(sessionId)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const token = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session' });
    return;
  }

  const response = adminQuizRestore(token.authUserId, quizId);
  if ('error' in response) {
    res.status(400).json(response);
  } else {
    res.json({});
  }
});

app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const sessionId = req.header('token');

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const response = adminQuizRestore(token.authUserId, quizId);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  } else {
    res.json({});
  }
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const data = getData();
  const token = req.body.token as string;

  if (!sessionIdValidator(token)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session' });
    return;
  }

  const authUserId = findToken.authUserId;
  const email = req.body.email;
  const nameFirst = req.body.nameFirst;
  const nameLast = req.body.nameLast;

  const bodyObj = updateUserDetails(email, nameFirst, nameLast, authUserId);
  if ('error' in bodyObj) {
    res.status(400).json(bodyObj);
  } else {
    res.json(bodyObj);
  }
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const data = getData();
  const token = req.header('token');

  if (!sessionIdValidator(token)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    throw HTTPError(403, 'Provided token is of valid structure, but is not for a currently logged in session');
  }

  const authUserId = findToken.authUserId;
  const email = req.body.email;
  const nameFirst = req.body.nameFirst;
  const nameLast = req.body.nameLast;

  const bodyObj = updateUserDetails(email, nameFirst, nameLast, authUserId);
  if ('error' in bodyObj) {
    throw HTTPError(400, bodyObj.error);
  } else {
    res.json(bodyObj);
  }
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const data = getData();
  const token = req.body.token;

  // Checks if token inputted is of valid structure
  if (!sessionIdValidator(token)) {
    res.status(401).json({ error: 'Token is of invalid structure' });
    return;
  }

  // Checks if token inputted correlates to a token in data.tokens array
  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session' });
    return;
  }

  const authUserId = findToken.authUserId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const bodyObj = updateUserPassword(authUserId, oldPassword, newPassword);
  if ('error' in bodyObj) {
    res.status(400).json(bodyObj);
  } else {
    res.json(bodyObj);
  }
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const data = getData();
  const token = req.header('token');

  // Checks if token inputted is of valid structure
  if (!sessionIdValidator(token)) {
    throw HTTPError(401, 'Token is of invalid structure');
  }

  // Checks if token inputted correlates to a token in data.tokens array
  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    throw HTTPError(403, 'Provided token is of valid structure, but is not for a currently logged in session');
  }

  const authUserId = findToken.authUserId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const bodyObj = updateUserPassword(authUserId, oldPassword, newPassword);
  if ('error' in bodyObj) {
    throw HTTPError(400, bodyObj.error);
  } else {
    res.json(bodyObj);
  }
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const data = getData();
  const sessionToken = req.body.token as string;
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  // Gets quiz Id through a params path
  const quizId = parseInt(req.params.quizid);
  // Get question Id through a params path
  const questionId = parseInt(req.params.questionid);
  if (!sessionIdValidator(sessionToken)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }
  if (!tokenFound) {
    res.status(403).json({ error: 'User is not logged in' });
    return;
  }

  // Calls function in quiz.ts and responds on server accordingly
  const response = adminQuizQuestionDuplicate(tokenFound.authUserId, quizId, questionId);
  if ('error' in response) {
    res.status(400).json(response);
  } else {
    res.json(response);
  }
});

app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const data = getData();
  const sessionToken = req.header('token') as string;
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  // Gets quiz Id through a params path
  const quizId = parseInt(req.params.quizid);
  // Get question Id through a params path
  const questionId = parseInt(req.params.questionid);
  if (!sessionIdValidator(sessionToken)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  if (!tokenFound) {
    throw HTTPError(403, 'User is not logged in');
  }
  // Calls function in quiz.ts and responds on server accordingly
  const response = adminQuizQuestionDuplicate(tokenFound.authUserId, quizId, questionId);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  } else {
    res.json(response);
  }
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const data = getData();
  // Gets token and a newPosition number through the body
  const sessionToken = req.body.token as string;
  const newPosition = req.body.newPosition as number;
  // Check if token exists
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  const quizId = parseInt(req.params.quizid);
  // Check if quiz exists
  const questionId = parseInt(req.params.questionid);
  if (!sessionIdValidator(sessionToken)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }
  if (!tokenFound) {
    res.status(403).json({ error: 'User is not logged in' });
    return;
  }
  // Calls function in quiz.ts and respond accordingly on the server
  const response = adminQuizQuestionMove(tokenFound.authUserId, quizId, questionId, newPosition);
  if ('error' in response) {
    res.status(400).json(response);
  } else {
    res.json(response);
  }
});

app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const data = getData();
  // Gets token and a newPosition number through the body
  const sessionToken = req.header('token') as string;
  const newPosition = req.body.newPosition as number;
  // Check if token exists
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  if (!sessionIdValidator(sessionToken)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  if (!tokenFound) {
    throw HTTPError(403, 'User is not logged in');
  }
  // Calls function in quiz.ts and respond accordingly on the server
  const response = adminQuizQuestionMove(tokenFound.authUserId, quizId, questionId, newPosition);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  } else {
    res.json(response);
  }
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const sessionId = req.query.token as string;

  if (!sessionIdValidator(sessionId)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const token: Tokens = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged-in session' });
    return;
  }
  const result = adminQuestionDelete(token.authUserId, quizId, questionId);

  if ('error' in result) {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
});

app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const sessionId = req.header('token') as string;

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token: Tokens = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }
  const result = adminQuestionDelete(token.authUserId, quizId, questionId);

  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const body: QuestionUpdateBody = req.body;

  const sessionId = body.token;
  if (!sessionIdValidator(sessionId)) {
    res.status(401).json({ error: 'Token is not a valid structure' });
    return;
  }

  const token: Tokens = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged-in session' });
    return;
  }

  const result = adminQuestionUpdate(
    token.authUserId,
    quizId,
    questionId,
    body.questionBody.question,
    body.questionBody.duration,
    body.questionBody.points,
    body.questionBody.answers
  );

  if ('error' in result) {
    res.status(400).json(result);
  } else {
    res.json({ });
  }
});

app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const body: QuestionUpdateBody = req.body;

  const sessionId = req.header('token') as string;

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token: Tokens = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const result = adminQuestionUpdate(
    token.authUserId,
    quizId,
    questionId,
    body.questionBody.question,
    body.questionBody.duration,
    body.questionBody.points,
    body.questionBody.answers,
    body.questionBody.thumbnailUrl
  );

  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json({ });
  }
});

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const sessionId = req.header('token');
  const autoStartNum = req.body.autoStartNum;

  if (!sessionIdValidator(sessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = data.tokens.find(element => element.sessionId === sessionId);
  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const result = adminQuizSessionStart(token.authUserId, quizId, autoStartNum);

  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});

app.post('/v1/player/join/', (req: Request, res: Response) => {
  const joinObject: PlayerJoinObject = req.body;

  const result = playerJoinQuizSession(joinObject.name, joinObject.sessionId);

  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});

app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);

  const response = playerQuestionInfo(playerId, questionPosition);

  if ('error' in response) {
    throw HTTPError(400, response.error);
  } else {
    res.json(response);
  }
});

app.get('/v1/player/:playerid/', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);

  const result = playerStatus(playerId);

  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const answerIds = req.body.answerIds;

  const response = playerSubmissionOfAnswers(playerId, questionPosition, answerIds);

  if ('error' in response) {
    throw HTTPError(400, response.error);
  } else {
    res.json(response);
  }
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const quizSessionId = parseInt(req.params.sessionid);
  const authSessionId = req.header('token');
  const action = req.body.action;

  if (!sessionIdValidator(authSessionId)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const token = data.tokens.find(element => element.sessionId === authSessionId);
  if (!token) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const result = adminQuizSessionUpdate(token.authUserId, quizId, quizSessionId, action);

  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});

app.get('/v1/admin/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const authSessionId = req.header('token');

  const token = data.tokens.find(element => element.sessionId === authSessionId);

  const result = adminQuizViewSessions(token.authUserId, quizId);
  res.json(result);
});

app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const message = req.body.message;

  const result = sendChatMessages(playerId, message.messageBody);

  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const sessionToken = req.header('token');
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  // Checks token valid structure
  if (!sessionIdValidator(sessionToken)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  if (!tokenFound) {
    throw HTTPError(403, 'User is not logged in');
  }
  // Calls function and responds accordingly
  const response = adminQuizSessionStatus(tokenFound.authUserId, quizId, sessionId);
  if ('error' in response) {
    res.status(400).json(response);
  } else {
    res.json(response);
  }
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid/results', (req: Request, res: Response) => {
  const sessionToken = req.header('token');
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  // Checks token valid structure
  if (!sessionIdValidator(sessionToken)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  if (!tokenFound) {
    throw HTTPError(403, 'User is not logged in');
  }
  // Calls function and responds accordingly
  const response = adminQuizSessionResults(tokenFound.authUserId, quizId, sessionId);
  if ('error' in response) {
    res.status(400).json(response);
  } else {
    res.json(response);
  }
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid/results/csv', (req: Request, res: Response) => {
  const sessionToken = req.header('token');
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const tokenFound = data.tokens.find(tokens => tokens.sessionId === sessionToken);
  // Checks token valid structure
  if (!sessionIdValidator(sessionToken)) {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  if (!tokenFound) {
    throw HTTPError(403, 'User is not logged in');
  }
  // Calls function and responds accordingly
  const response = adminQuizSessionResultsCSV(tokenFound.authUserId, quizId, sessionId);
  if ('error' in response) {
    res.status(400).json(response);
  } else {
    res.json(response);
  }
});

app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);

  const result = displayChatMessages(playerId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});

app.get('/v1/player/:playerid/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);

  const result = getPlayerResults(playerId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});

app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const data = getData();
  const quizId = parseInt(req.params.quizid);
  const token = req.header('token');
  const imgUrl = req.body.imgUrl;

  if (!sessionIdValidator(token)) {
    throw HTTPError(401, 'Token is not of a valid structure');
  }

  const findToken = data.tokens.find(element => element.sessionId === token);
  if (!findToken) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const authUserId = findToken.authUserId;

  const bodyObj = updateQuizThumbnail(authUserId, quizId, imgUrl);
  if ('error' in bodyObj) {
    throw HTTPError(400, bodyObj.error);
  } else {
    res.json(bodyObj);
  }
});

app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);

  const result = playerResultsInfo(playerId, questionPosition);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    res.json(result);
  }
});
// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

function HTTPError(statusCode: number, message: string) {
  const error: CustomError = {
    statusCode: statusCode,
    message: message,
  };
  throw error;
}
