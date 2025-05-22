interface AuthInputs {
	type: string;
	label: string;
	placeholder: string;
	marginStyle: string;
	w: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
}

export default function AuthInput({ setInput, label, placeholder, marginStyle, w }: AuthInputs) {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// console.log('zid is', e.target.value);
		setInput(e.target.value);
		// TODO: when Add Button has been clicked
		// setInput("");
	}

	return (
		<div className={`flex justify-center ${marginStyle}`}>
			<div className="flex flex-col">
				<div className="text-[#f1e9e9] text-xl"> {label} </div>
				<input onChange={handleInputChange} style={{ fontFamily: "Lexend" }} placeholder={placeholder} className={`mt-2 p-4 ${w} h-[2.5em] border-2 border-[#f1e9e9] bg-[#f1e9e9] rounded-md`} />
			</div>
		</div>
	);
}