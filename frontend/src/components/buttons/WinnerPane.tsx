import './WinnerPane.css'

interface Winner {
    position: string,
    name: string,
    extraInfo?: string,
}

interface WinnerPaneInputs {
	winner: Winner,
}

export default function WinnerPane({ winner }: WinnerPaneInputs) {
	return (
        <div className="winner-pane">
            <div className="text-center md:text-2xl mb-[1rem]">Position: {winner.position}</div>
            <div className="text-center text-2xl mb-[1rem] md:text-5xl">Winner: {winner.name}</div>
            <div className="text-center text-2s mb-[1rem] md:text-5xl">{winner.extraInfo}</div>

        </div>
	);
}