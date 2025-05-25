// changed this slightly so it's not purely visual, and is actually reactive
// and has an onclick function

interface ThinButtonInputs {
	text: string;
	margin: string;
	onClick: () => void; // Add this!
  }
  
  export default function ThinButton({ text, margin, onClick }: ThinButtonInputs) {
	return (
	  <div className={`flex justify-center ${margin}`}>
		<button
		  className="w-[23em] h-[2.5em] border-1 border-[#f1e9e9] rounded-4xl text-[#f1e9e9] bg-white/20 cursor-pointer"
		  onClick={onClick} // Wire up the click event
		>
		  {text}
		</button>
	  </div>
	);
  }
  
