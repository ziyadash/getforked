import { error } from "node:console";
import { electionDatabase, getElectionData, saveElectionDatabaseToFile } from "../data/dataStore";
import { validateSessionId } from "./servicesUtil";
import { Election, Question } from "../../../shared/interfaces";



export const viewPositions = async (
  userSessionId: string, sessionCode: string
): Promise<{ positions: Question[] }> => {
        const sessionValidation = await validateSessionId(userSessionId);
                console.log("HEllow owrld ")
        console.log(userSessionId)
        console.log(sessionCode)

        if ('error' in sessionValidation) {
        throw new Error(sessionValidation.error);
        }
         let foundElection: Election | undefined;

  await getElectionData((map) => {
    for (const election of map.values()) {
      if (election.sessionCode === sessionCode) {
        foundElection = election;
        break;
      }
    }
  });

  if (foundElection) {
    return { positions: foundElection.questions };
  }

  throw new Error("Could not find election");
};
/**
 * Other functions such as:
 * Moving to another position or getting the current position a voter is at
 * probably isn't required because the frontend handles moving between voting positions.
 * As a result, we just need to record the candidates a voter has voted for, for each position.
 */