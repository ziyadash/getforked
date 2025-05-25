// Placeholder can change all of this
interface Voter {
    username: string,
}

interface Image {
    name: string,
    image_url: string,
    file_id: string,
}

// have a flag called isActive
// move other variables into election object once isActive
interface Election {
    id: number,
    authUserId: string, // the owner of the election
    name: string,
    description: string,
    images: string[]
    // Optional | Remote
    location?: string,
    date_time_start: Date,
    date_time_end: Date,
    requires_zid: boolean,

    // fields that are used once election is activated
    isActive: boolean,
    questions: Question[],
    sessionCode?: string, // voters enter this to join session
    voters: Voter[], // array of voters' zids
} 

enum QuestionType {
    // SelectOne, we are only doing preferential voting for the mvp!
    Preferential,
}

interface Question {
    id: number;
    title: string; // e.g. "Treasurer"
    candidates: Candidate[];
    questionType: QuestionType; // preferential
    ballot: Ballot[]
}

// a voter submits a ballot for the position
// it contains an ordered list of the candidates for this particular question
export interface Ballot {
    preferences: number[],
}

// Change this to use ZK Proof 
interface VoteAnswer {
    zid: string,
    answerIndex: number | number[],
}

// NOTE: 
interface Candidate {
    zId?: number;
    fullName: string;
    description: string;
    image: string;
    votes: number[]; // an array of preferential votes; votes[0] is the number of first preference votes
    candidateIndex: number,
}

export {
    Voter,
    // Location,
    Image,
    Election,
    Question,
    QuestionType,
    VoteAnswer,
    Candidate,
}

export interface User {
    name: string, 
    userId: string
};

// this is a generic session
// we will discuss more design later but it makes sense to have 
// different kinds of sessions maybe for voting vs creating votes?
export interface Session {
    sessionId: string; // this is the JWT
    userId: string; // hash zid
    createdAt: Date;
}  

export interface DataStore {
    users: User[],
    elections: Election[],
}

export interface SessionStore {
    sessions: Session[]
}

// remove id from session when its no longer active
// scrap this?
export interface ElectionSession {
    electionId: number, // references an election object 
    sessionCode: string, // voters enter this to join session
    voters: Voter[], // array of voters' zids
}

// enum ElectionSessionStates {
//     // * Get election status. States: Ready to start | In progress | Ended
//     READY_TO_START,
//     IN_PROGRESS,
//     ENDED
// }

interface Voter {
    zid: string
}

/*
creator side: 
- activate an election (turn into a live session)
- accept users into the .voters field (emit a session code for users to join with)
- when session is stopped, we deactivate the sesssion

voter side:
- register as a user
- join a vote by entering the session code emitted above

voting process:
- Question object contain an array of ballots
- a voter submits their ballot, which is an array of the candidates for that particular question
- we can have logic for counting votes based on preferential voting from this array of ballots, for every question
*/
