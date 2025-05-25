// changed this slightly so it's not purely visual, and is actually reactive
// and has an onchange function

interface AuthInputs {
	type: string;
	label: string;
	placeholder: string;
	marginStyle: string;
	w: string;
	h: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
}

export default function AuthInput({ type, label, placeholder, marginStyle, w, h, setInput }: AuthInputs) {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// console.log('zid is', e.target.value);
		setInput(e.target.value);
		// TODO: when Add Button has been clicked
		// setInput("");
	}

	return (
		<div className={`flex justify-center ${marginStyle}`}>
			<div className="flex flex-col">
				<div className="text-[#f1e9e9]"> {label} </div>
				<input onChange={(e) => {setInput(e.target.value)}} type={type} style={{ fontFamily: "Lexend" }} placeholder={placeholder} className="p-4 w-[23em] h-[2.5em] border-2 border-[#f1e9e9] bg-[#f1e9e9] rounded-xl" />
			</div>
		</div >
	);
  }
  