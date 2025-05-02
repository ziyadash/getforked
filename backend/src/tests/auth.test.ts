import { clear, getData, getHashOf, getSessions, verifySessionId } from "../dataStore";
import request from 'sync-request';
import config from "../config/config";
import { encryptWithPublicKey } from "../../../shared/src/encryptionBackend";

const port = config.port;
const url = 'http://localhost';


////////////////////////////// HELPER FUNCTIONS ///////////////////////

function post(route: string, body: Record<string, any>) {
  const res = request('POST', `${url}:${port}${route}`, { json: body });
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

////////////////////////////// ROUTES  ////////////////////////////////
const registerRoute = '/api/auth/register';
const loginRoute = '/api/auth/login';
const logoutRoute = '/api/auth/logout';

////////////////////////////// STATUS CODES  //////////////////////////
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORISED = 401;


////////////////////////////// TEST CASES  ////////////////////////////////

describe('auth register tests!', () => {
  beforeEach(() => {
    clear();
  });
  
  // you can manually check that this test works by using your own zid and zpass
  // (it works)
  test.skip('Successful, returns a sessionId', () => {
    const zId = encryptWithPublicKey('z12345678');
    const zPass = encryptWithPublicKey('password'); // helper function directly encrypts, not testing encrypton from frontend
    const res = post(registerRoute, { zId, zPass });

    expect(res.statusCode).toEqual(OK);
    expect(res.body).toEqual({
      sessionId: expect.any(String),
    });

    // verify session id
    const sessionId = res.body.sessionId.toString();
    const payload = verifySessionId(sessionId);
    expect(payload).toEqual(expect.objectContaining({
      userId: getHashOf('z12345678'),
    }));
  });

  test('Unsuccessful, missing zId + zPass', () => {
    const res = post(registerRoute, {});
    expect(res.statusCode).toEqual(BAD_REQUEST);
    expect(res.body).toEqual({
      error: expect.any(String),
    });
  });
});

describe('auth login tests!', () => {
  beforeEach(() => {
    clear();
  });

  afterEach(() => {
    clear();
  });

  test.skip('Successful, logs in the user and returns a session id', () => {
    const zId = encryptWithPublicKey('z12345678');
    const zPass = encryptWithPublicKey('password'); // helper function directly encrypts, not testing encrypton from frontend
    const regRes = post(registerRoute, { zId, zPass });

    expect(regRes.statusCode).toEqual(OK);

    // log out
    const sessionId = regRes.body.sessionId;
    const logoutRes = post(logoutRoute, { token: sessionId });

    // then log back in again
    const loginRes = post(loginRoute, { zId, zPass });
    expect(loginRes.statusCode).toEqual(OK);
    expect(loginRes.body).toEqual({
      sessionId: expect.any(String),
    });

    // verify session id
    const payload = verifySessionId(sessionId);
    expect(payload).toEqual(expect.objectContaining({
      userId: getHashOf('z5478718'),
    })); 
  });

  test('Unsuccessful login, missing body', () => {
    const res = post(loginRoute, {});
    expect(res.statusCode).toEqual(BAD_REQUEST);
    expect(res.body).toEqual({
      error: expect.any(String),
    });
  });
});

describe('auth logout tests!', () => {
  beforeEach(() => {
    clear();
  });

  afterEach(() => {
    clear();
  });

  // you can manually check that this test works by using your own zid and zpass
  // (it works)
  test.skip('Successful logout', () => {
    const zId = encryptWithPublicKey('z12345678');
    const zPass = encryptWithPublicKey('password'); // helper function directly encrypts, not testing encrypton from frontend

    const regRes = post(registerRoute, { zId, zPass });
    expect(regRes.statusCode).toEqual(OK);

    const sessionId = regRes.body.sessionId;
    const logoutRes = post(logoutRoute, { token: sessionId });

    expect(logoutRes.statusCode).toEqual(OK);
    expect(logoutRes.body).toEqual({ message: expect.any(String) });

    // Confirm session is gone
    const sessions = getSessions();
    const stillActive = sessions.find(s => s.sessionId === sessionId);
    expect(stillActive).toBeUndefined();
  });

  test('Unsuccessful logout: missing token', () => {
    const res = post(logoutRoute, {});
    expect(res.statusCode).toEqual(BAD_REQUEST);
    expect(res.body).toEqual({
      error: expect.any(String),
    });
  });

  test('Unsuccessful logout: invalid token', () => {
    const res = post(logoutRoute, { token: 'not-a-real-jwt' });
    expect(res.statusCode).toEqual(UNAUTHORISED);
    expect(res.body).toEqual({
      error: expect.any(String),
    });
  });
});