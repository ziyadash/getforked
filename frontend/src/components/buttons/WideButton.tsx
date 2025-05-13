import './WideButton.css'

interface WideButtonInputs {
	text?: string,
	margin?: string,
    children?: React.ReactNode
}

export default function WideButton({ text, margin, children }: WideButtonInputs) {
	return (
		<div className={`flex justify-center ${margin}`}>
			<button className="wide-button">
				<div className="absolute left-1/2 -translate-x-1/2 max-w-[30vw] overflow-y-auto">{text}</div>
                <div className="buttons">
                    {children}
                </div>
			</button>
		</div>
	);
}