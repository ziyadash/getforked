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
    const originalCandidates = ['Matthew Stewart', 
        'Lara Thiele', 
        'Lotte Schipper']
    
    const [candidates, setPositions] = useState(originalCandidates);

    const handleReorder = (index: number, direction: 'up' | 'down') => {
        setPositions(reorderElements(candidates, index, direction));
    };

    const handleDeletion = (index: number) => {
        setPositions(deleteElement(candidates, index));
    }

    const handleReset = () => {
        setPositions(originalCandidates);
    }

    return (
        <StyledBackground className='main'>
            {/* Add logout button */}

            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[2rem]
                p-[4rem]
            ">
                <Heading text="Now voting for Treasurer"/>
                <MedHeading text="Order or delete the candidates based on your choice."></MedHeading>
                {candidates.map((name, index) => (
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
                    <SmallThinButton text="Confirm" margin="mt-[0em]" />
                </div>
                
                <ThinButton text="I want to abstain" margin="mt-[2em]" />
            </div>
        </StyledBackground>
    )
}