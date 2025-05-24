// import {
//   getSessions,
// } from '../data/dataStore';
// import { Question, Election, QuestionType, } from '../../../shared/interfaces';
// import { Candidate } from '../../../shared/interfaces';
// import { StatusCodes } from 'http-status-codes';
// import { validateUserId, validateElectionId, validatePositionId } from './servicesUtil';

// // TODO: potentially refactor this code so that the createCandidate function is just called in 
// // addPosition/editPosition? seems unnecessary to have a whole API server route for it
// // but im not sure so il think about it and implement later once code has been merged together 

// /**
//  * User creates a vote session.
//  * @param userSessionId 
//  * @param title 
//  * @param description
//  * @param images
//  * @param startDate
//  * @param endDate
//  * @param zid_requirement
//  * @param locationOfVote
//  * @returns new election ID
//  */

// interface authCreateVoteSessionProps {
//   userSessionId: string;
//   title: string;
//   description: string;
//   images: string[];
//   startDate: Date;
//   endDate: Date;
//   zid_requirement: boolean;
//   locationOfVote?: string;
// }

// export const authCreateVoteSession = (
//   props: authCreateVoteSessionProps
// ): number => {
//   const db = getData();
//   const sessions = getSessions();

//   console.log('creating session');

//   if (!db) {
//     throw new Error('Failed to load data store');
//   }

//   // Find userId from session
//   const session = sessions.sessions.find(
//     (session) => session.sessionId === props.userSessionId
//   );

//   console.log('current sessions:');
//   console.log(sessions);
//   console.log('Found session:');
//   console.log(session);
//   console.log('User session ID:');
//   console.log(props.userSessionId);

//   if (!session) throw new Error('Invalid session ID');

//   const userId = session.userId; // we store hashed zids, not raw zids

//   if (props.title.trim().length === 0) {
//     throw new Error('Title cannot be empty');
//   }

//   const questions: Question[] = [];

//   const newElection: Election = {
//     id: db.elections.length + 1, // subject to change
//     authUserId: userId,
//     name: props.title,
//     description: props.description,
//     images: props.images,
//     location: props.locationOfVote,
//     date_time_start: props.startDate,
//     date_time_end: props.endDate,
//     requires_zid: props.zid_requirement,
//     questions,
//   };

//   db.elections.push(newElection);
//   setData(db);

//   return newElection.id;
// };

// // functionality for creating voting sessions is already done
// // gonna add the functionality for:
// // - viewing voting sessions, corresponding to the "Create Vote - View Voting Sessions"  page
// // - viewing positions in a vote, corresponding to the "Create Vote - Add Positions"  page
// // - adding a position to a vote, corresponding to the "Create Vote - Add Position"  page
// // TODO: this is a stub for the addPosition HTTP route
// interface addPositionProps {
//   authuserId: number;
//   voteId: number;
//   title: string;
//   questionType: QuestionType // e.g., "single" or "multiple"
// }

// // stub/hard code this function, patrick is implementing it
// export function addPosition(positionData: addPositionProps) {
//   const data = getData();
//   const { authuserId, voteId, title, questionType } = positionData;

//   // Find the matching election
//   const election = data.elections.find(
//     e => e.id === voteId && e.authUserId === String(authuserId)
//   );

//   if (!election) {
//     throw new Error("Election not found. This should not happen in a stub.");
//   }

//   const newQuestionId = election.questions.length + 1;

//   const newQuestion = {
//     id: newQuestionId,
//     title,
//     candidates: [],
//     questionType,
//   };

//   // Mutate election's questions
//   election.questions.push(newQuestion);

//   // Set updated data back
//   setData(data);

//   return { positionId: newQuestion.id };
// }

// // functionality for creating votes is already done
// // functionality for creating positions in a vote is already done
// // gonna add the functionality for:
// // - viewing candidates for a position, corresponding to the "Create Vote - Add Position"  page
// // - adding candidates for a position, corresponding to the "Create Vote - Add Position"  page
// // - editing candidates for a position, corresponding to the "Create Vote - Edit Candidate"  page

// interface createCandidateProps {
//   authuserId: string,
//   voteId: number,
//   positionId: number,
//   name: string,
// };

// // creates a candidate for a given position in a vote
// // based on the figma, in creating a candidate we need only specify a name
// // if we want to add more information to a candidate we can select it,
// // and edit the name, description, and add an image 
// export function createCandidate(candidateData: createCandidateProps): any {
//   const userCheck = validateUserId(candidateData.authuserId);
//   if ('error' in userCheck) return userCheck;

//   const electionCheck = validateElectionId(
//     candidateData.voteId,
//     candidateData.authuserId
//   );
//   if ('error' in electionCheck) return electionCheck;

//   const positionCheck = validatePositionId(
//     electionCheck.election,
//     candidateData.positionId
//   );
//   if ('error' in positionCheck) return positionCheck;

//   const db = getData();
//   const { position } = positionCheck;
//   const newCandidateIndex = position.candidates.length + 1;

//   const newCandidate: Candidate = {
//     fullName: candidateData.name,
//     description: '',
//     image: '',
//     votes: [],
//     candidateIndex: newCandidateIndex
//   };

//   position.candidates.push(newCandidate);
//   setData(db);

//   return newCandidateIndex;
// }

// interface editCandidateProps {
//   authuserId: string;
//   voteId: number;
//   positionId: number;
//   candidateIndex: number;
//   name: string;
//   description: string;
//   image: string;
// }

// export function editCandidate(candidateData: editCandidateProps): any {
//   const userCheck = validateUserId(candidateData.authuserId);
//   if ('error' in userCheck) return userCheck;

//   const electionCheck = validateElectionId(
//     candidateData.voteId,
//     candidateData.authuserId
//   );
//   if ('error' in electionCheck) return electionCheck;

//   const positionCheck = validatePositionId(
//     electionCheck.election,
//     candidateData.positionId
//   );
//   if ('error' in positionCheck) return positionCheck;

//   const db = getData();
//   const { position } = positionCheck;
  
//   const candidate = position.candidates.find(
//     c => c.candidateIndex === candidateData.candidateIndex
//   );
  

//   if (!candidate) {
//     return { error: 'Candidate not found', status: StatusCodes.NOT_FOUND };
//   }

//   candidate.fullName = candidateData.name;
//   candidate.description = candidateData.description;
//   candidate.image = candidateData.image;

//   setData(db);
//   return 0;
// }

// interface deleteCandidateProps {
//   authuserId: string;
//   voteId: number;
//   positionId: number;
//   candidateIndex: number;
// }

// export function deleteCandidate(candidateData: deleteCandidateProps): any {
//   console.log("we are in delete candidate, service layer!");
//   const userCheck = validateUserId(candidateData.authuserId);
//   if ('error' in userCheck) return userCheck;
//   console.log('1');
//   const electionCheck = validateElectionId(
//     candidateData.voteId,
//     candidateData.authuserId
//   );
//   if ('error' in electionCheck) return electionCheck;
//   console.log('2')
//   const positionCheck = validatePositionId(
//     electionCheck.election,
//     candidateData.positionId
//   );
//   if ('error' in positionCheck) return positionCheck;
//   console.log('3')

//   const db = getData();
//   const { position } = positionCheck;

//   const foundIndex = position.candidates.findIndex(
//     c => c.candidateIndex === candidateData.candidateIndex
//   );
  
//   if (foundIndex === -1) {
//     return { error: 'Candidate not found', status: StatusCodes.NOT_FOUND };
//   }
//   console.log('4')

//   console.log("before: "+db.elections[0].questions[0].candidates);
//   position.candidates.splice(foundIndex, 1);
//   console.log("after: "+db.elections[0].questions[0].candidates);
//   setData(db);
//   return 0;  
// }


// interface viewCandidateProps {
//   authuserId: string;
//   voteId: number;
//   positionId: number;
// }

// export function viewCandidates(positionData: viewCandidateProps): any {

//   const userCheck = validateUserId(positionData.authuserId);
//   if ('error' in userCheck) return userCheck;

//   const electionCheck = validateElectionId(
//     positionData.voteId,
//     positionData.authuserId
//   );
//   if ('error' in electionCheck) return electionCheck;

//   const positionCheck = validatePositionId(
//     electionCheck.election,
//     positionData.positionId
//   );
//   if ('error' in positionCheck) return positionCheck;

//   const { position } = positionCheck;
//   return position.candidates;
// }

// interface deleteAllCandidatesprops {
//   authuserId: string;
//   voteId: number;
//   positionId: number;
// }

// // util function, to be removed later?
// export function deleteAllCandidates(positionData: deleteAllCandidatesprops) {
//   const userCheck = validateUserId(positionData.authuserId);
//   if ('error' in userCheck) return userCheck;

//   const electionCheck = validateElectionId(
//     positionData.voteId,
//     positionData.authuserId
//   );
//   if ('error' in electionCheck) return electionCheck;

//   const positionCheck = validatePositionId(
//     electionCheck.election,
//     positionData.positionId
//   );
//   if ('error' in positionCheck) return positionCheck;

//   const { position } = positionCheck;

//   // delete all candidates from this position
//   position.candidates = []

//   return position.candidates;


//   return;
// }
