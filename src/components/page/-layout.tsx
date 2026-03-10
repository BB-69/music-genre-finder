import FileSelectSpace from "./FileSelectSpace";

const Layout = () => {
  return (
    <div
      className="relative flex flex-col w-full h-full
      bg-linear-to-br from-[#F00] via-[#241919] to-[#F50]"
    >
      <div className="absolute inset-0 bg-black opacity-70" />

      <div
        className="relative w-full h-screen pb-10
        flex flex-col justify-center items-center gap-10"
      >
        <div className="relative">
          <div className="text-[#F66] text-2xl p-2">Music Genre Finder</div>
        </div>

        <div
          className="w-[60vw] h-[40vh] p-[1.5px]
          flex justify-center items-center
          bg-gradient-to-b from-[#F00] to-white
          rounded-lg"
        >
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 p-[6px]
              bg-black rounded-lg"
            >
              <FileSelectSpace />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
