import StyledBackground from "../components/background/StyledBackground";
import AuthBox from "../components/containers/AuthBox";

export default function VoterPage() {
    return (
        <StyledBackground className='main'>
            <AuthBox user='voter' />
        </StyledBackground>
    )
}
