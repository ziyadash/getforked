import WideButton from "./WideButton"
import SmallButton from "./SmallButton"
import './ManageVotePanel.css'

interface ManageVotePanelInputs {
	text: string,
	page: string,
}


export default function ManageVotePanel({text, page}: ManageVotePanelInputs) {
    let buttons = []
    if (page == 'votingSessions') {
        buttons = ['edit', 'start', 'delete']
    } else{
        buttons = ['up', 'down', 'delete']
    }
    return (
        <div className="manage-vote-panel-container">
            <WideButton text={text} margin="mt-[4em]"/>
            <div className="small-buttons-container">
                {buttons.map((type) => (
                    <SmallButton buttonType={type} />
                ))}
            </div>
        </div>
    )
}