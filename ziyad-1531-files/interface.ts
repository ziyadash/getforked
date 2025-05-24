// This file will store any interfaces used in any of the code

// Interfaces in auth/user related files
export interface UserDetail {
  user: {
    userId: number;
    name: string;
    email: string;
    numSuccessfulLogins: number;
    numFailedPasswordsSinceLastLogin: number;
  };
}

export interface OldPasswords {
  oldPassword: string;
}

export interface User {
  userId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  oldPasswords: OldPasswords[];
}

export interface Tokens {
  sessionId: string,
  authUserId: number,
}

export interface RegisterBody {
  email: string;
  password: string;
  nameFirst: string;
  nameLast: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

// Interfaces for quiz related files
export interface Answers {
  answerId: number,
  answer: string,
  correct: boolean,
  colour: string,
}

export interface QuizListItem {
  quizId: number;
  name: string;
}

export interface CorrectRankScore {
  name: string,
  rank: number,
  score: number
}

export interface QuestionAndAnswer {
  questionId: number;
  question: string;
  duration: number;
  points: number;
  answers: Answers[];
  thumbnailUrl?: string
  totalAnswertime?: number,
  totalUsersAnswering?: number,
  averageAnswerTime?: number,
  totalUsersCorrect?: number,
  percentCorrect?: number,
  playersCorrect?: string[]
  correctRankScore? : CorrectRankScore[]
}

export interface QuizInfo {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: QuestionAndAnswer[];
  duration: number;
  thumbnailUrl?: string,
}

export interface Quiz {
  authUserId: number;
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  totalDuration: number;
  numQuestions: number;
  questions: QuestionAndAnswer[];
  thumbnailUrl?: string,
}

export interface QuizCreateRequest {
  token: string;
  name: string;
  description: string;
}

export interface QuestionCreateBody {
  token: string;
  questionBody: QuestionAndAnswer;
}

export interface QuestionUpdateBody {
  token: string;
  questionBody: {
    question: string;
    duration: number;
    points: number;
    answers: Answers[];
    thumbnailUrl: string,
  };
}

export enum Colours {
  Red = 'red',
  Blue = 'blue',
  Green = 'green',
  Yellow = 'yellow',
  Purple = 'purple',
  Brown = 'brown',
  Orange = 'orange',
}

export enum QuizSessionAction {
  NextQuestion = 'NEXT_QUESTION',
  GoToAnswer = 'GO_TO_ANSWER',
  GoToFinalResults = 'GO_TO_FINAL_RESULTS',
  End = 'END'
}

export enum QuizState {
  Lobby = 'LOBBY',
  QuestionCountdown = 'QUESTION_COUNTDOWN',
  QuestionOpen = 'QUESTION_OPEN',
  QuestionClose = 'QUESTION_CLOSE',
  AnswerShow = 'ANSWER_SHOW',
  FinalResults = 'FINAL_RESULTS',
  End = 'END'
}

export interface Messages {
  messageBody: string,
  playerId: number,
  playerName: string,
  timeSent: number,
}

export interface Player {
  playerId: number,
  name: string,
  answers: Answers[][],
  messages: Messages[],
  totalScore?: number
  scoreForOneQuestion?: number,
  timeTakenForOneQuestion?: number;
  ifCorrect?: boolean;
}

export interface SubmissionofAnswers {
  answerIds: number[],
}

export interface QuizSession {
  sessionId: number;
  atQuestion: number;
  autoStartNum: number;
  players: Player[];
  state: QuizState;
  metadata: Quiz;
  questionTimerStarted: number;
}

// Interfaces for general use
export interface ErrorMsg {
  error: string;
}

export interface Data {
  users: User[];
  quizzes: Quiz[];
  tokens: Tokens[];
  trash: Quiz[];
  quizSessions: QuizSession[];
}

export interface Timers {
  quizSessionId: number;
  countdownTimer: NodeJS.Timer;
  questionTimer: NodeJS.Timer;
}

export interface CustomError {
  statusCode: number,
  message: string,
}

export interface PlayerJoinObject {
  sessionId: number,
  name: string,
}

export interface UsersRankByScore {
  name: string,
  score: number
}

export interface QuestionCorrectBreakdown {
  answerId: number,
  playersCorrect: string[]
}

export interface QuestionResults {
  questionId: number,
  questionCorrectBreakdown: QuestionCorrectBreakdown[],
  averageAnswerTime: number,
  percentCorrect: number
}

export interface FinalQuizResults {
  usersRankedByScore: UsersRankByScore[],
  questionResults: QuestionResults[]
}
