import './WideButton.css'

interface WideButtonInputs {
	text?: string,
	margin?: string,
    children?: React.ReactNode
}

export default function WideButton({ text, margin, children }: WideButtonInputs) {
	return (
		<div className={`flex justify-center ${margin}`}>
            {/* TODO add hover opacity effect */}
			<button className="wide-button">
				<span className="absolute left-1/2 -translate-x-1/2">{text}</span>
                <div className="ml-auto mr-[2rem] flex items-center gap-2">
                    {children}
                </div>
			</button>
		</div>
	);
}