import fs from 'fs';

// importing interfaces
import { QuestionAndAnswer, Data, Timers } from './interface';

// YOU SHOULD MODIFY THIS OBJECT BELOW

// Read stored data in from file
const dataString = fs.readFileSync('./src/dataDB.json');
let data: Data = JSON.parse(String(dataString));

// NodeJS.Timer cannot be stored in JSON so timers are separate to the data store
// This does mean they aren't persistent (assumption, not specified in spec)
let timers: Timers[] = [];

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

function saveData() {
  fs.writeFileSync('./src/dataDB.json', JSON.stringify(data));
}

// Use get() to access the data
function getData(): Data {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: Data) {
  data = newData;
  saveData();
}

function clearAllTimers() {
  timers = [];
}

function getTimers(quizSessionId: number): Timers {
  return timers.find((timer) => timer.quizSessionId === quizSessionId);
}

function createTimers(quizSessionId: number) {
  timers.push({ quizSessionId: quizSessionId, countdownTimer: null, questionTimer: null });
}

export { getData, setData, clearAllTimers, getTimers, createTimers, QuestionAndAnswer };
