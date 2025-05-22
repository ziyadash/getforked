import ZidXButton from "../buttons/ZidXButton";

interface ZidContainerInputs {
  width: string,
  height: string,
  zid: string,
}

export default function ZidContainers({ width, height, zid }: ZidContainerInputs) {
  return (
    <div className={`${width} ${height} border-1 border-[#F1E9E9] rounded-4xl backdrop-blur-2xl bg-gradient-to-t from-violet-900/50 to-white/30 relative mb-2 flex flex-col justify-center`}>
      <p>{zid}</p>
      <ZidXButton id={""} />
    </div>
  );
} 