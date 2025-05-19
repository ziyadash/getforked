import {
  getData,
  setData,
  getSessions,
} from '../data/dataStore';
import { Question, Election, Session, User } from '../../../shared/interfaces';

/**
 * User creates a vote session.
 * @param userSessionId 
 * @param title 
 * @param description
 * @param images
 * @param startDate
 * @param endDate
 * @param zid_requirement
 * @param locationOfVote
 * @returns new election ID
 */

interface authCreateVoteSessionProps {
  userSessionId: string;
  title: string;
  description: string;
  images: string[];
  startDate: Date;
  endDate: Date;
  zid_requirement: boolean;
  locationOfVote?: string;
}

export const authCreateVoteSession = (
  props: authCreateVoteSessionProps
): number => {
  const db = getData();
  const sessions = getSessions();

  console.log('creating session');

  if (!db) {
    throw new Error('Failed to load data store');
  }

  // Find userId from session
  const session = sessions.find(
    (session) => session.sessionId === props.userSessionId
  );

  console.log('current sessions:');
  console.log(sessions);
  console.log('Found session:');
  console.log(session);
  console.log('User session ID:');
  console.log(props.userSessionId);

  if (!session) throw new Error('Invalid session ID');

  const userId = session.userId; // we store hashed zids, not raw zids

  if (props.title.trim().length === 0) {
    throw new Error('Title cannot be empty');
  }

  const questions: Question[] = [];

  const newElection: Election = {
    id: db.elections.length + 1, // subject to change
    authUserId: userId,
    name: props.title,
    description: props.description,
    images: props.images,
    location: props.locationOfVote,
    date_time_start: props.startDate,
    date_time_end: props.endDate,
    requires_zid: props.zid_requirement,
    questions,
  };

  db.elections.push(newElection);
  setData(db);

  return newElection.id;
};

// functionality for creating voting sessions is already done
// gonna add the functionality for:
// - viewing voting sessions, corresponding to the "Create Vote - View Voting Sessions"  page
// - viewing positions in a vote, corresponding to the "Create Vote - Add Positions"  page
// - adding a position to a vote, corresponding to the "Create Vote - Add Position"  page