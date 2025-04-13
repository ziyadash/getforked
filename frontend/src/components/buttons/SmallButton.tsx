import smallButton from './smallButton.svg';
import './SmallButton.css'
import editIcon from '../../assets/svg/edit.svg'

interface SmallButtonInputs {
	buttonType: string,
}

export default function SmallButton({buttonType}: SmallButtonInputs) {
    let buttonIcon
    if (buttonType == 'edit') {
        buttonIcon = editIcon
    }

	return (
        <div className="small-button-container">
            <img src={smallButton} alt="Small button"/>
            <img src={buttonIcon} />
        </div>
    )
}