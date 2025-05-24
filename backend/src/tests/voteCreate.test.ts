// import request from 'supertest';
// import app from '../app';
// import { clear, createAndStoreSession } from '../data/dataStore';
// import { verifySessionId } from '../data/dataUtil';
// import {
//   post,
//   get,
//   del,
//   registerRoute,
//   createPositionRoute,
//   createVoteRoute,
//   createCandidateRoute,
//   editCandidateRoute,
//   getDeleteCandidateRoute,
//   getViewCandidatesRoute,
//   zidPlainText,
//   zpassPlainText
// } from './testUtil';
// import { encryptWithPublicKey } from '../../../shared/src/encryptionBackend';


// // TODO: implement Brandan's feedback for this test:
// /*
// Tests should never directly call functions on the backend. 
// The server should be treated as a black box that you can 
// interact with via API's., e.g in your POST /createVoteSession test. 
// Instead of creating a User Session should either re-use an existing 
// User session from a prevoius test, or Create a session by calling the user API and returning that test. 
// */
// // we should actually use the API route:
// //    router.post('/login', login);
// // to register a user and create a session token
// describe.skip('POST /createVoteSession', () => {
//   beforeEach(() => {
//     clear();
//   });

//   it('Should create a vote session successfully', async () => {
//     const mockUserId = 'test-user-123';

//     console.log("Mock user ID: " + mockUserId);

//     const sessionId = createAndStoreSession(mockUserId);

//     console.log("mock session id: " + sessionId);

//     const res = await request(app)
//       .post('/api/auth/createVoteSession')
//       .set('x-session-id', sessionId)
//       .send({
//         title: "Test Election",
//         description: "This is a test election",
//         images: [],
//         startDate: new Date(),
//         endDate: new Date(),
//         zid_requirement: false,
//         locationOfVote: "library"
//       });
    
//     console.log("received status: " + res.statusCode);



//     expect(res.statusCode).toEqual(200);
//     expect(res.body.result).toBeDefined();
//   });
// });

// // tests for creating positions


// // tests for viewing/adding/modifying/deleting candidates in a position
// describe.skip('tests for viewing/adding/modifying/deleting candidates in a position', () => {
//   clear();

//   // Register user
//   const zId = encryptWithPublicKey(zidPlainText);
//   const zPass = encryptWithPublicKey(zpassPlainText);
//   const registerRes = post(registerRoute, { zId, zPass });
//   console.log("ADSJALSKDJKJFLK AJFLKJALDKJ")
//   console.log(registerRes);
//   const sessionId = registerRes.body.sessionId.toString();
//   const payload = verifySessionId(sessionId);
//   const authUserId = payload?.userId;

//   // Create vote
//   const createVoteRes = post(
//     createVoteRoute,
//     {
//       title: "Test Election yippee!",
//       description: 'This is a test election. it has one position to vote for.',
//       images: [],
//       startDate: new Date(),
//       endDate: new Date(),
//       zid_requirement: false,
//       locationOfVote: "library"
//     },
//     { 'x-session-id': sessionId }
//   );
//   const voteId = createVoteRes.body.result;

//   // Create position
//   const createPositionRes = post(
//     createPositionRoute,
//     {
//       authuserId: authUserId,
//       voteId,
//       title: "President",
//       questionType: "single",
//     },
//     { 'x-session-id': sessionId }
//   );
//   const positionId = createPositionRes.body.result.positionId;

//   it('Should create, view, edit, and delete a candidate successfully', () => {
//     console.log("the authUserid is... " + authUserId);
//     // 1. Create Candidate
//     const createCandidateRes = post(
//       createCandidateRoute,
//       {
//         authuserId: authUserId,
//         voteId,
//         positionId,
//         name: "Jane Doe"
//       },
//       { 'x-session-id': sessionId }
//     );
//     expect(createCandidateRes.statusCode).toBe(200);

//     // 2. View Candidates (after creation)
//     const viewRes1 = get(
//       getViewCandidatesRoute(voteId, positionId),
//       {
//         authuserId: authUserId,
//       },
//       { 'x-session-id': sessionId }
//     );

//     expect(viewRes1.statusCode).toBe(200);
//     expect(viewRes1.body.result).toHaveLength(1);
//     expect(viewRes1.body.result[0].fullName).toBe("Jane Doe");

//     const candidateIndex = viewRes1.body.result[0].candidateIndex;

//     // 3. Edit Candidate
//     const editCandidateRes = post(
//       editCandidateRoute,
//       {
//         authuserId: authUserId,
//         voteId,
//         positionId,
//         candidateIndex,
//         name: "Jane Smith",
//         description: "Updated bio",
//         image: "https://example.com/image.jpg"
//       },
//       { 'x-session-id': sessionId }
//     );
//     expect(editCandidateRes.statusCode).toBe(200);

//     // 4. View Candidates (after edit)
//     const viewRes2 = get(
//       getViewCandidatesRoute(voteId, positionId),
//       {
//         authuserId: authUserId,
//       },
//       { 'x-session-id': sessionId }
//     );

//     expect(viewRes2.statusCode).toBe(200);
//     expect(viewRes2.body.result).toHaveLength(1);
//     expect(viewRes2.body.result[0].fullName).toBe("Jane Smith");
//     expect(viewRes2.body.result[0].description).toBe("Updated bio");

//     // 5. Delete Candidate
//     const deleteRes = del(
//       getDeleteCandidateRoute(voteId, positionId, candidateIndex),
//       {
//         authuserId: authUserId,
//       },
//       { 'x-session-id': sessionId }
//     );
    
//     expect(deleteRes.statusCode).toBe(200);

//     // 6. View Candidates (after deletion)
//     const viewRes3 = get(
//       getViewCandidatesRoute(voteId, positionId),
//       {
//         authuserId: authUserId,
//       },
//       { 'x-session-id': sessionId }
//     );

//     expect(viewRes3.statusCode).toBe(200);
//     expect(viewRes3.body.result).toHaveLength(0);
//   });
// });
