import StyledBackground from "../components/background/StyledBackground";
// import Heading from "../components/buttons/Heading";
import MedHeading from "../components/buttons/MedHeading";

export default function VotingFinishPage() {
    return (
        <StyledBackground className='main'>
            <div className="
                flex flex-col justify-center items-center 
                h-[100vh] w-full
                text-center gap-[1em]
                p-[2rem]
            ">
                <MedHeading text="The voting process is now complete!"></MedHeading>
                <MedHeading text="Thank you for participating."></MedHeading>

            </div>
        </StyledBackground>
    )
}