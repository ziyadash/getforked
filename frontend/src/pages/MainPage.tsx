import './MainPage.css'
import MainButton from '../components/buttons/MainButton'
import StyledBackground from '../components/background/StyledBackground'
import logo from '../assets/logo.png';

export default function MainPage() {
    return (
        <StyledBackground className='main'>
            <div className='flex flex-row'>
                <img className='mr-[20px]' src={logo} alt="electus logo" width="55" />
                <h1 className="title">Electus</h1>
            </div>

            <div className="button-container">
                <MainButton action="Join Vote" />
                <MainButton action="Create Vote" />
            </div>
        </StyledBackground>
    )
}

