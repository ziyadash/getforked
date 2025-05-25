// Placeholder can change all of this
interface Voter {
    username: string,
}

interface Image {
    name: string,
    image_url: string,
    file_id: string,
}

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
    questions: Question[]
} 

enum QuestionType {
    // SelectOne, we are only doing preferential voting for the mvp!
    Preferential,
}

interface Question {
    id: number;
    title: string; // e.g. "Treasurer"
    candidates: Candidate[];
    questionType: QuestionType; // e.g. "single" or "multiple"
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
    userId: string,
};

// this is a generic session
// we will discuss more design later but it makes sense to have 
// different kinds of sessions maybe for voting vs creating votes?
export interface Session {
    sessionId: string; // this is the JWT
    userId: string;
    createdAt: Date;
}  

export interface DataStore {
    users: User[],
    elections: Election[],
}

export interface SessionStore {
    sessions: Session[]
}
