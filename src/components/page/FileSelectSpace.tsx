import { useEffect, useRef, useState, type ChangeEvent } from "react";

function FileSelectSpace() {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<"select" | "process" | "result">("select");

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (phase != "select") return;

    const selected = e.target.files?.[0] ?? null;
    setFile(selected);

    if (selected != null) setPhase("process");
  }

  async function processFile() {
    setPhase("result");
  }

  function showResult() {
    setPhase("select");
  }

  useEffect(() => {
    switch (phase) {
      case "select":
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        break;
      case "process":
        processFile();
        break;
      case "result":
        showResult();
        break;
      default:
    }
  }, [phase]);

  return (
    <>
      {phase == "select" && (
        <label
          className="w-full h-full p-1
          flex justify-center items-center
          border-[1px] rounded-md
          border-white hover:border-[#F33]
          text-white text-[14px] cursor-pointer
          overflow-hidden duration-200
          group relative"
        >
          <div
            className="absolute w-[100px] h-[100px] animate-spin duration-200
            border-[1px] rounded-full border-transparent group-hover:border-white
            group-hover:border-l-transparent group-hover:border-r-transparent"
          />

          <div
            className="absolute w-[150px] h-[150px] duration-200
            opacity-0 group-hover:opacity-100
            group-hover:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_60%)]"
          />

          <span
            className="flex justify-center break-all
            w-full gap-1 min-w-0 text-center
            group-hover:shadow-white"
          >
            {file ? "Selected: " + file.name : "Select File"}
          </span>

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}

      {phase == "process" && (
        <div
          className="w-full h-full gap-4
          flex flex-row justify-center items-center
          text-white"
        >
          <div
            className="w-[20px] h-[20px] animate-spin
            border-4 border-white rounded-full
            border-l-transparent border-r-transparent"
          />
        </div>
      )}

      {phase == "result" && (
        <div
          className="w-full h-full gap-4
          flex flex-row justify-center items-center
          text-white"
        >
          Result!
        </div>
      )}
    </>
  );
}

export default FileSelectSpace;
