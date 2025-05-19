interface AuthInputs {
	label: string;
	placeholder: string;
	marginStyle: string;
	w: string;
}

export default function AuthInput({ label, placeholder, marginStyle, w }: AuthInputs) {
	return (
		<div className={`flex justify-center ${marginStyle}`}>
			<div className="flex flex-col">
				<div className="text-[#f1e9e9]"> {label} </div>
				<input style={{ fontFamily: "Lexend" }} placeholder={placeholder} className={`mt-2 p-4 w-[${w}] h-[2.5em] border-2 border-[#f1e9e9] bg-[#f1e9e9] rounded-xl`} />
			</div>
		</div >
	);
}