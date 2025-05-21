import StyledBackground from "../components/background/StyledBackground";
// import Heading from "../components/buttons/Heading";
import MedHeading from "../components/buttons/MedHeading";

export default function VotingFinishPage() {
    return (
        <StyledBackground className='main'>
            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[2rem]
                p-[4rem]
            ">
                <MedHeading text="The voting process is now complete!"></MedHeading>
                <MedHeading text="Thank you for participating."></MedHeading>

            </div>
        </StyledBackground>
    )
}