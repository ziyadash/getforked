interface ThinButtonInputs {
	text: string,
	margin: string,
}

export default function ThinButton({ text, margin }: ThinButtonInputs) {
	return (
		<div className={`flex justify-center ${margin}`}>
			<button className="max-w-[90vw] w-[23em] h-[2.5em] border-1 border-[#f1e9e9] rounded-4xl text-[#f1e9e9] bg-white/20 cursor-pointer">
				{text}
			</button>
		</div>
	);
}