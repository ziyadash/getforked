import './Heading.css'

interface HeadingInputs {
	text: string
}

export default function Heading({text}: HeadingInputs) {
  return (
    <div className='flex flex-row'>
      <h1 className="heading">{text}</h1>
    </div>
  );
}