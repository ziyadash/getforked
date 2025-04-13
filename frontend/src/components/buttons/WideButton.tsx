interface WideButtonInputs {
	text: string,
	margin: string,
}

export default function WideButton({ text, margin }: WideButtonInputs) {
	return (
		<div className={`flex justify-center ${margin}`}>
			<button 
                className="
                w-[56rem] h-[7rem] 
                border-[2px] border-white rounded-[5rem]
                bg-gradient-to-br from-white/40 to-white/0
                text-[#f1e9e9] text-xl
                ">
				{text}
			</button>
		</div>
	);
}