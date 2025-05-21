interface OrganiserInputs {
  text: string,
  width: string,
  height: string,
}

export default function OrganiserButton({ text, width, height }: OrganiserInputs) {
  const addVoterToList = () => {

  }

  return (
    <div className={`cursor-pointer ${width} ${height} text-white text-center content-center border-1 border-[#F1E9E9] rounded-4xl backdrop-blur-2xl bg-linear-150 bg-gradient-to-br from-transparent to-white-50`}>
      <button className={`cursor-pointer text-xl`} onClick={addVoterToList}>
        {text}
      </button>
    </div>
  );
}