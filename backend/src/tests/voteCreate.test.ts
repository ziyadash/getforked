import request from 'supertest';
import app from '../app';
import { clear, createAndStoreSession } from '../data/dataStore';
import { verifySessionId } from '../data/dataUtil';
import {
  post,
  get,
  del,
  registerRoute,
  createPositionRoute,
  createVoteRoute,
  createCandidateRoute,
  editCandidateRoute,
  getDeleteCandidateRoute,
  getViewCandidatesRoute,
  zidPlainText,
  zpassPlainText
} from './testUtil';
import { encryptWithPublicKey } from '../../../shared/src/encryptionBackend';


// TODO: implement Brandan's feedback for this test:
/*
Tests should never directly call functions on the backend. 
The server should be treated as a black box that you can 
interact with via API's., e.g in your POST /createVoteSession test. 
Instead of creating a User Session should either re-use an existing 
User session from a prevoius test, or Create a session by calling the user API and returning that test. 
*/
// we should actually use the API route:
//    router.post('/login', login);
// to register a user and create a session token
// describe('POST /createElection', () => {
//   beforeEach(async () => {
//     // await clear();
//   });

//   it.only('Should create an election successfully after registering user', async () => {
//     const zId = encryptWithPublicKey(zidPlainText);
//     const zPass = encryptWithPublicKey(zpassPlainText);

//     // Register user and retrieve session
//     const regRes = await request(app)
//       .post(registerRoute)
//       .send({ zId, zPass });

//     expect(regRes.statusCode).toEqual(200);
//     const sessionId = regRes.body.sessionId;

//     // Create election with valid session
//     const res = await request(app)
//       .post('/api/auth/createElection')
//       .set('x-session-id', sessionId)
//       .send({
//         title: 'Test Election',
//         description: 'This is a test election',
//         images: [],
//         startDate: new Date(),
//         endDate: new Date(),
//         zid_requirement: false,
//         locationOfVote: 'library',
//       });

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.electionId).toBeDefined();
//   });
// });

// tests for creating positions


// tests for viewing/adding/modifying/deleting candidates in a position
describe('tests for viewing/adding/modifying/deleting candidates in a position', () => {
  let sessionId: string;
  let voteId: number;
  let positionId: number;

  beforeAll(async () => {
    // await clear();

    // Register user
    const zId = encryptWithPublicKey(zidPlainText);
    const zPass = encryptWithPublicKey(zpassPlainText);
    const registerRes = await request(app)
      .post(registerRoute)
      .send({ zId, zPass });

    expect(registerRes.statusCode).toBe(200);
    sessionId = registerRes.body.sessionId;

    // Create vote
    const createVoteRes = await request(app)
      .post(createVoteRoute)
      .set('x-session-id', sessionId)
      .send({
        title: "Test Election yippee!",
        description: "This is a test election. it has one position to vote for.",
        images: [],
        startDate: new Date(),
        endDate: new Date(),
        zid_requirement: false,
        locationOfVote: "library"
      });

    expect(createVoteRes.statusCode).toBe(200);
    voteId = createVoteRes.body.electionId;

    // Create position
    const createPositionRes = await request(app)
      .post(createPositionRoute)
      .set('x-session-id', sessionId)
      .send({
        voteId,
        title: "President",
        questionType: "single"
      });

    expect(createPositionRes.statusCode).toBe(200);
    positionId = createPositionRes.body.result.positionId;
  });

  it('Should create, view, edit, and delete a candidate successfully', async () => {
    // 1. Create Candidate
    const createCandidateRes = await request(app)
      .post(createCandidateRoute)
      .set('x-session-id', sessionId)
      .send({
        voteId,
        positionId,
        name: "Jane Doe"
      });

    expect(createCandidateRes.statusCode).toBe(200);

    // 2. View Candidates
    const viewRes1 = await request(app)
      .get(getViewCandidatesRoute(voteId, positionId))
      .set('x-session-id', sessionId);

    expect(viewRes1.statusCode).toBe(200);
    expect(viewRes1.body.result).toHaveLength(1);
    expect(viewRes1.body.result[0].fullName).toBe("Jane Doe");

    const candidateIndex = viewRes1.body.result[0].candidateIndex;

    // 3. Edit Candidate
    const editCandidateRes = await request(app)
      .post(editCandidateRoute)
      .set('x-session-id', sessionId)
      .send({
        voteId,
        positionId,
        candidateIndex,
        name: "Jane Smith",
        description: "Updated bio",
        image: "https://example.com/image.jpg"
      });

    expect(editCandidateRes.statusCode).toBe(200);

    // 4. View Candidates (after edit)
    const viewRes2 = await request(app)
      .get(getViewCandidatesRoute(voteId, positionId))
      .set('x-session-id', sessionId);

    expect(viewRes2.statusCode).toBe(200);
    expect(viewRes2.body.result).toHaveLength(1);
    expect(viewRes2.body.result[0].fullName).toBe("Jane Smith");
    expect(viewRes2.body.result[0].description).toBe("Updated bio");

    // 5. Delete Candidate
    const deleteRes = await request(app)
      .delete(getDeleteCandidateRoute(voteId, positionId, candidateIndex))
      .set('x-session-id', sessionId);

    expect(deleteRes.statusCode).toBe(200);

    // 6. View Candidates (after deletion)
    const viewRes3 = await request(app)
      .get(getViewCandidatesRoute(voteId, positionId))
      .set('x-session-id', sessionId);

    expect(viewRes3.statusCode).toBe(200);
    expect(viewRes3.body.result).toHaveLength(0);
  });
});
