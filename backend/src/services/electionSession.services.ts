import { error } from "node:console";
import { getHashOf } from "src/data/dataUtil";
import { electionDatabase, getElectionData, saveElectionDatabaseToFile } from "../data/dataStore";
import { Ballot } from '../../../shared/interfaces';

/**
 * Get election status.
 * An election is ready to start if it has at least one position
 */
export function isElectionActive(electionId: string): boolean {
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
export async function activateElectionSession(electionId: string): Promise<string> {
    let sessionCode: string = '';
    // get election data
    await getElectionData(electionDatabase => {
        // check if election has atleast one pos
        // check if question has atleast two candidates
        // check if election is valid

        const election = electionDatabase.get(electionId);
        if (!election) {
            throw new Error("invalid election id");
        }
        election.isActive = true;

        sessionCode = Math.random().toString(36).slice(2, 7);
        // add verification to make sure it is unique

        election.sessionCode = sessionCode;
    })

    await saveElectionDatabaseToFile();

    // return ses
    return sessionCode;
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
export async function addUsertoActiveElectionSession(electionId: string, sessionCode: string, userSessionId: string) {
    // get election data
    await getElectionData(electionDatabase => {

        const election = electionDatabase.get(electionId);
        if (!election) {
            throw new Error("invalid election id");
        }


        if (election.sessionCode && election.sessionCode != sessionCode) {
            throw new Error("invalid session code");
        }

        // validate userSessionId

        election.voters.push()
    })

    await saveElectionDatabaseToFile();

    // return ses
    return true;
}

/**
 * Delete zId from authorised votes in election
 * return boolean
 */
// export const deleteVoter = (electionId: string, sessionCode: string, userSessionId: string): boolean => {
//     return true;
// }

/**
 * End an election
 * checks if election session is live
 * side effects: update sessionIsLive flag to false
 */
export const endElection = (electionId: string): boolean => {
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
export const getResult = async (electionId: string) => {
    const resultMap: Record<string, string> = {}; // key: question, value: winner

    // get election data
    await getElectionData(electionDatabase => {

        const election = electionDatabase.get(electionId);
        if (!election) {
            throw new Error("invalid election id");
        }

        if (election.isActive) {
            throw new Error("election not ended");
        }

        const questions = election.questions;

        for (const q of questions) {
            const winnerId = calculatePreferentialVotingWinner(q.ballot);
            const winnerObj = q.candidates.find(c => c.candidateIndex === winnerId);
            if (winnerObj) {
                resultMap[q.title] = winnerObj.fullName;
            }
        }


    })

    await saveElectionDatabaseToFile();

}

function calculatePreferentialVotingWinner(ballots: Ballot[]): number {
  // Get all candidate indices from ballots to know how many candidates there are
  const numCandidates = Math.max(...ballots.flat()) + 1;

  // Start with all candidates active
  let activeCandidates = new Set<number>();
  for (let i = 0; i < numCandidates; i++) {
    activeCandidates.add(i);
  }

  while (true) {
    const voteCount = new Map<number, number>();
    for (const candidate of activeCandidates) {
      voteCount.set(candidate, 0);
    }

    // Count votes for the highest-ranked active candidate on each ballot
    for (const ballot of ballots) {
      const topChoice = ballot.find(c => activeCandidates.has(c));
      if (topChoice !== undefined) {
        voteCount.set(topChoice, (voteCount.get(topChoice) || 0) + 1);
      }
    }

    // Total votes in this round
    const totalVotes = [...voteCount.values()].reduce((a, b) => a + b, 0);

    // Check if any candidate has more than half the votes
    for (const [candidate, count] of voteCount) {
      if (count > totalVotes / 2) {
        return candidate; // Winner found
      }
    }

    // Find candidate(s) with the fewest votes
    const minVotes = Math.min(...voteCount.values());
    for (const [candidate, count] of voteCount) {
      if (count === minVotes) {
        activeCandidates.delete(candidate);
      }
    }

    // If only one candidate remains, return them
    if (activeCandidates.size === 1) {
      return [...activeCandidates][0];
    }

    // If no candidates remain (tie or all eliminated), return -1
    if (activeCandidates.size === 0) {
      return -1;
    }
  }
}