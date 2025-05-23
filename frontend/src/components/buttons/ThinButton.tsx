interface ThinButtonInputs {
	text: string,
	margin: string,
    onClick?: () => void
}

export default function ThinButton({ text, margin, onClick }: ThinButtonInputs) {
	return (
		<div className={`flex justify-center ${margin}`} onClick={onClick}>
			<button className="w-[23em] h-[2.5em] max-w-[90vw] hover:opacity-80 transition delay-30 border-1 border-[#f1e9e9] rounded-4xl text-[#f1e9e9] bg-linear-130 from-transparent to-white/33 cursor-pointer" onClick={onClick}>
				{text}
			</button>
		</div>
	);
}