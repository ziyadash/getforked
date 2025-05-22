interface ZidButtonInput {
  id: string,
}
// for organiser view on zID list
export default function ZidXButton({ id }: ZidButtonInput) {
  const removeZidContainer = () => {
    // expecting use of ID to remove the correct box

  }

  return (
    <button onClick={removeZidContainer} className="flex flex-col items-center absolute right-5 text-xl top-0.53 w-8 h-8 border-1 border-[#F1E9E9] rounded-xl bg-white/40 transition delay-100 ease-in hover:opacity-70 hover:cursor-pointer">
      x
    </button>
  );
}