interface AuthInputs {
	type: string;
	label: string;
	placeholder: string;
	marginStyle: string;
}

export default function AuthInput({ type, label, placeholder, marginStyle }: AuthInputs) {
	return (
		<div className={`flex justify-center ${marginStyle}`}>
			<div className="flex flex-col">
				<div className="text-[#f1e9e9]"> {label} </div>
				<input type={type} style={{ fontFamily: "Lexend" }} placeholder={placeholder} className="font-[caption] p-4 w-[23em] h-[2.5em] text-md border-2 border-[#f1e9e9] bg-[#f1e9e9] rounded-xl" />
			</div>
		</div >
	);
}