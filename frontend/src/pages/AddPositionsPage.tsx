import { useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";
import SmallButton from "../components/buttons/SmallButton";
import WideAddButton from "../components/buttons/WideAddButton";
import { deleteElement, reorderElements } from "./helpers";

export default function AddPositionsPage() {
    const [positions, setPositions] = useState([
        'Treasurer', 
        'GEDI Officer', 
        'Admin Officer',
        'Co-President (Project Operations)',
    ]);

    const handleReorder = (index: number, direction: 'up' | 'down') => {
        setPositions(reorderElements(positions, index, direction));
    };

    const handleDeletion = (index: number) => {
        setPositions(deleteElement(positions, index));
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
                <Heading text="Add Positions"/>
                {positions.map((name, index) => (
                    <div className="flex flex-row justify-center items-center gap-[2vw]">
                        <WideButton text={name} margin="mt-[0]">
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
                        </WideButton>
                        <SmallButton buttonType="bin" onClick={() => handleDeletion(index)}/>
                    </div>
                ))}
                <WideAddButton></WideAddButton>
            </div>
        </StyledBackground>
    )
}