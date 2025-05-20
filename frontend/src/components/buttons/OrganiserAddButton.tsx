interface OrganiserInputs {
  text: string,
  width: string,
  height: string,
}


export default function OrganiserMainButton({ text, width, height }: OrganiserInputs) {
  return (
    <div className={`w-${width} h-${height}`} >
      {text}
    </div >
  );
}