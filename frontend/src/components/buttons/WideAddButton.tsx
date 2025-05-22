import addIcon from '../../assets/svg/add.svg'
import './WideButton.css'

export default function WideAddButton() {
	return (
		<div>
			<button className="wide-button">
                <img className="w-[6rem]" src={addIcon}></img>
			</button>
		</div>
	);
}