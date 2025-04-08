// Placeholder can change all of this
interface Voter {
    username: string,
}

interface Location {
    name: string,
    latitude: number,
    longitude: number,
}

interface Image {
    name: string,
    image_url: string,
    file_id: string,
}

interface Election {
    name: string,
    description: string,
    images: string[]
    // Optional | Remote
    location?: Location,
    date_time_start: Date,
    date_time_end: Date,
    requires_zid: boolean,

    // Positions
    questions: Question[]
} 

enum QuestionType {
    SelectOne,
    Preferential,
}

interface Question {
    //Title e.g. Treasurer
    title: string
    candidates: Candidate[],
    vote_answers: VoteAnswer[],
}

// Change this to use ZK Proof 
interface VoteAnswer {
    zid: string,
    answerIndex: number | number[],
}

interface Candidate {
    fullname: string,
    zid?: string,
}