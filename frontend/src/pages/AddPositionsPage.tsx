import { useState } from "react";
import { useNavigate } from "react-router";
import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";
import SmallButton from "../components/buttons/SmallButton";
import WideAddButton from "../components/buttons/WideAddButton";
import { deleteElement, reorderElements } from "../helpers";

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

    const navigate = useNavigate();
    const handleAddPositions = () => {
        navigate('/creator/create-vote/add-position')
    }
    const goBack = () => {
        navigate('/creator/create-vote')
    }

    return (
        <StyledBackground className='main'>
            {/* Add logout button */}

            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[0rem]
                p-[6rem]
            ">
                <button className="hover:cursor-pointer text-white p-4 text-2xl absolute top-2 left-4 z-10" onClick={goBack}>
                    ←
                </button>
                <Heading text="Add Positions" />
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
                        <SmallButton buttonType="bin" onClick={() => handleDeletion(index)} />
                    </div>
                ))}
                <WideAddButton onClick={() => handleAddPositions()}></WideAddButton>
            </div>
        </StyledBackground>
    )
}