import { useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import Heading from "../components/buttons/Heading";
import MedHeading from "../components/buttons/MedHeading";
import SmallButton from "../components/buttons/SmallButton";
import { deleteElement, reorderElements } from "./helpers";
import CandidatePane from "../components/buttons/CandidatePane";
import ThinButton from "../components/buttons/ThinButton";
import SmallThinButton from "../components/buttons/SmallThinButton";

export default function VoterVotingPage() {
    const originalCandidates = [
        {
            position: 'Treasurer',
            candidates: ['Matthew Stewart', 'Lara Thiele', 'Lotte Schipper']
        },
        {
            position: 'GEDI Officer',
            candidates: ['Alexander Taylor', 'Alexia Lebrun', 'Carolina Barboza']
        }
    ]
    
    const [candidates, setCandidates] = useState(originalCandidates);
    const [positionIndex, setPositionIndex] = useState(0);

    const positionName = candidates[positionIndex].position;
    const currentCandidates = candidates[positionIndex].candidates;

    const handleReorder = (index: number, direction: 'up' | 'down') => {
        const updated = reorderElements(currentCandidates, index, direction);
        const newCandidates = [...candidates];
        newCandidates[positionIndex] = {
            position: newCandidates[positionIndex].position,
            candidates: updated
        };
        setCandidates(newCandidates);
    };

    const handleDeletion = (index: number) => {
        const updated = deleteElement(currentCandidates, index);
        const newCandidates = [...candidates];
        newCandidates[positionIndex] = {
            position: newCandidates[positionIndex].position,
            candidates: updated
        };
        setCandidates(newCandidates);
    }

    const handleReset = () => {
        const newCandidates = [...candidates];
        newCandidates[positionIndex] = originalCandidates[positionIndex]
        setCandidates(originalCandidates);
    }

    const handleConfirm = () => {
        if (positionIndex < candidates.length - 1) {
            setPositionIndex(positionIndex + 1);
        }
    };

    const handleAbstain = () => {
        if (positionIndex < candidates.length - 1) {
            setPositionIndex(positionIndex + 1);
        }
    };

    return (
        <StyledBackground className='main'>
            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[2rem]
                p-[4rem]
            ">
                <Heading text={`Now voting for ${positionName}`}/>
                <MedHeading text="Order or delete the candidates based on your choice."></MedHeading>
                {currentCandidates.map((name, index) => (
                    <div className="flex flex-row justify-center items-center gap-[2vw]">
                        <CandidatePane order={index+1} text={name} margin="mt-[0]">
                            <div className="buttons-container">
                                <SmallButton 
                                    buttonType="up" 
                                    onClick={() => handleReorder(index, 'up')} 
                                />
                                <SmallButton 
                                    buttonType="down" 
                                    onClick={() => handleReorder(index, 'down')} 
                                />
                            </div>
                        </CandidatePane>
                        <SmallButton buttonType="bin" onClick={() => handleDeletion(index)}/>
                    </div>
                ))}
                <div className="flex flex-row justify-between gap-2 items-center">
                    <SmallThinButton text="Reset" margin="mt-[0em]" onClick={() => handleReset()}  />
                    <SmallThinButton 
                        text={positionIndex === candidates.length - 1 ? 'Finish' : 'Confirm'} 
                        margin="mt-[0em]" 
                        onClick={() => handleConfirm()} 
                    />
                </div>
                
                <ThinButton text="I want to abstain" margin="mt-[2em]" onClick={() => handleAbstain()} />
            </div>
        </StyledBackground>
    )
}