import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { searchWithGemini } from "../API/gemini"; //////////////////////

function FileSelectSpace() {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<"select" | "process" | "result">("select");
  const [geminiResult, setGeminiResult] = useState(""); //////////////////////////////

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (phase != "select") return;

    const selected = e.target.files?.[0] ?? null;
    setFile(selected);

    if (selected != null) setPhase("process");
  }

  async function processFile() {
    ///////////////////////////////////////
    if (!file) {
      setPhase("result");
      return;
    }

    try {
      // Send the audio file to Gemini for analysis
      const prompt =
        "กรุณาวิเคราะห์ไฟล์เสียงนี้: 1. เพลงนี้เป็นแนวเพลงอะไร 2. มีเครื่องดนตรีอะไรบ้าง 3. จังหวะและอารมณ์ของเพลงเป็นแบบไหน";
      const answer = await searchWithGemini(prompt, file);

      // Got the answer, store it
      setGeminiResult(answer);
    } catch (error) {
      console.error(error);
      setGeminiResult(
        "เกิดข้อผิดพลาดระหว่างการวิเคราะห์ไฟล์เสียง กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      // Loading finished, switch the UI page to show the result
      setPhase("result");
    }
  } ////////////////////////////////////////////////

  function showResult() {
    setPhase("select");
    setGeminiResult(""); // Clear the old message
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
      case "result": //////////////////////////////////////////////////////
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
            {file ? "เลือกไฟล์แล้ว: " + file.name : "เลือกไฟล์"}
          </span>

          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
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
      {phase == "result" && ( //////////////////////////////////////////////////
        <div
          className="w-full h-full p-4 gap-4
          flex flex-col justify-center items-center
          text-white bg-black/40 rounded-md border-[1px] border-white/30"
        >
          {/* Result display box (scrollable in case the answer is long) */}
          <div className="w-full max-h-full overflow-y-auto text-sm text-left whitespace-pre-wrap leading-relaxed px-2">
            {geminiResult}
          </div>

          {/* Button to go back and select a new file */}
          <button
            onClick={showResult}
            className="px-4 py-2 mt-2 border-[1px] border-white rounded hover:bg-white hover:text-black transition-colors duration-200 text-sm font-bold"
          >
            วิเคราะห์ไฟล์อื่น
          </button>
        </div>
      )}
      ////////////////////////////////////////////////////
    </>
  );
}

export default FileSelectSpace;
