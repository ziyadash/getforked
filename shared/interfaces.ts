// Placeholder can change all of this
interface Voter {
    username: string,
}

// interface Location {
//     name: string,
//     latitude: number,
//     longitude: number,
// }

interface Image {
    name: string,
    image_url: string,
    file_id: string,
}

interface Election {
    id: number,
    authUserZId: string, // the owner of the election
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
    SelectOne,
    Preferential,
}

interface Question {
    //Title e.g. Treasurer
    id: number;
    title: string
    candidates: Candidate[],
    vote_answers: VoteAnswer[],
    questionType: QuestionType,
    QuestionType: QuestionType
}

// Change this to use ZK Proof 
interface VoteAnswer {
    zid: string,
    answerIndex: number | number[],
}

interface Candidate {
    zId?: number;
    fullName: string;
    description: string;
    image: string;
    votes: number;
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
    zId: string,
};

// this is a generic session
// we will discuss more design later but it makes sense to have 
// different kinds of sessions maybe for voting vs creating votes?
export interface Session {
    sessionId: string,
    userZId: string,
}

export interface DataStore {
    users: User[],
    elections: Election[],
}

export interface SessionStore {
    sessions: Session[]
}
