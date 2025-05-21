interface ZidContainerInputs {
  width: string,
  height: string,
  zid: string,
}

export default function ZidContainers({ width, height, zid }: ZidContainerInputs) {
  return (
    <div className={`${width} ${height} bg-purple-600 relative mb-2 flex flex-col justify-center`}>
      <p>{zid}</p>
      {/* X button for removal from list */}
      <div className="absolute right-5 top-0 w-10 h-10 bg-pink-400">
        x
      </div>
    </div>
  );
} 