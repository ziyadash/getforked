import StyledBackground from "../components/background/StyledBackground";
import AuthBox from "../components/containers/AuthBox";

export default function CreatorPage() {
    return (
        <StyledBackground className='main'>
            <AuthBox user={"creator"} />
        </StyledBackground>
    )
}