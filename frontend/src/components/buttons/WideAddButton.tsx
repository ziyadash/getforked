import addIcon from '../../assets/svg/add.svg'
import './WideButton.css'

export default function WideAddButton() {
	return (
		<div className={`flex flex-start`}>
            {/* TODO add hover opacity effect */}
			<button className="wide-button">
                <img className="w-[6rem]" src={addIcon}></img>
			</button>
		</div>
	);
}