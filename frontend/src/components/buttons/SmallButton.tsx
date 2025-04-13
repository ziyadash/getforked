import smallButton from './smallButton.svg';
import './SmallButton.css'
import editIcon from '../../assets/svg/edit.svg'
import startIcon from '../../assets/svg/start.svg'
import binIcon from '../../assets/svg/bin.svg'

interface SmallButtonInputs {
	buttonType: string,
}

export default function SmallButton({buttonType}: SmallButtonInputs) {
    let buttonIcon
    if (buttonType == 'edit') {
        buttonIcon = editIcon
    } else if (buttonType == 'start') {
        buttonIcon = startIcon
    } else if (buttonType == 'bin') {
        buttonIcon = binIcon
    }

	return (
        <button className="small-button">
            <img src={smallButton} alt="Small button"/>
            <img className="small-button-icon" src={buttonIcon} />
        </button>
    )
}