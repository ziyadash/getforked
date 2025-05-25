/**
 * Get election status. States: Ready to start | In progress | Ended
 * An election is ready to start if it has at least one position
 */
function isElectionActive(electionId: number): boolean {
    return true;
}

/**
 * Start an election - should return a code to join the election
 * This function is called once authorised votes have been added to the election.
 * sanity check the election TODO: 
 *  - at least one position,
 *  - at least two candidates in each position
 * check electionId is valid
 * side effect: place session code into election.sessionCode. 
 * side effect: update election.isActive to true
 * return: session code
 */
function activateElectionSession(electionId: number): string {
    return '42';
}

/**
 * Add users to authorised voters in this active election
 * note that a userId is a hashed zId.
 * error checks:
 *  - electionId is valid and refers to an ACTIVE election session
 *  - session code refers to this election and is valid
 *  - userSessionId is valid
 * side effect: add user to election.voters
 * return true if successful, false otherwise
 */
function addUsertoActiveElectionSession(electionId: number, sessionCode: string, userSessionId: string) {
    return true;
}

/**
 * Delete zId from authorised votes in election
 * return boolean
 */
const deleteVoter = (electionId: number, sessionCode: string, userSessionId: string): boolean => {
    return true;
}


/**
 * End an election
 * checks if election session is live
 * side effects: update sessionIsLive flag to false
 */
const endElection = (electionId: number): boolean => {
    return true;
}
/**
 * Get results of an election. Election must have ended
 * 
 * have helper function to calculate winner for preferential votes
 * take in question and returns winner
 * 
 * return hashmap: 
 *  key: question, value: winner (string)
 */
const getResult = (electionId: number) => {
    
}