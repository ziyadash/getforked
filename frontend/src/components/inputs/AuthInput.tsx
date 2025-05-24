// changed this slightly so it's not purely visual, and is actually reactive
// and has an onchange function

interface AuthInputs {
	label: string;
	placeholder: string;
	marginStyle: string;
	value: string;
	onChange: (val: string) => void;
  }
  
  export default function AuthInput({ label, placeholder, marginStyle, value, onChange }: AuthInputs) {
	return (
	  <div className={`flex justify-center ${marginStyle}`}>
		<div className="flex flex-col">
		  <div className="text-[#f1e9e9]"> {label} </div>
		  <input
			style={{ fontFamily: "Lexend" }}
			placeholder={placeholder}
			className="p-4 w-[23em] h-[2.5em] border-2 border-[#f1e9e9] bg-[#f1e9e9] rounded-xl"
			value={value}
			onChange={(e) => onChange(e.target.value)}
		  />
		</div>
	  </div>
	);
  }
  