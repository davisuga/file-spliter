import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import styles from "../styles/Home.module.css";
const splitFileToArray = (arr: string, size: number) =>
  arr
    .split("\n")
    .reduce(
      (acc, e, i) => (
        i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
      ),
      []
    );

const makeBlob = (text: string) => new Blob([text], { type: "text/plain" });
const joinFile = (file: string[]) => file.join("\n");

const addToZip = (zip: JSZip) => (blob: Blob, index: number) =>
  zip.file(`${index}.txt`, blob);

export default function App() {
  const [originalFile, setOriginalFile] = useState("");
  const [numberOfLines, setNumberOfLines] = useState(10);
  const [fileName, setFileName] = useState("example.zip");
  const [splitFiles, setSplitFiles] = useState<string[][]>([]);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    console.log(files[0].text().then(setOriginalFile));
  };

  const downloadFiles = () => {
    const zip = new JSZip();
    console.log(splitFiles.map(joinFile).map(makeBlob).map(addToZip(zip)));
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, fileName);
    });
  };

  useEffect(() => {
    const result = splitFileToArray(originalFile, numberOfLines);
    console.log(result);
    originalFile && setSplitFiles(result);
  }, [originalFile, numberOfLines]);

  return (
    <div className="p-10 flex-col bg-gray-900 h-screen">
      <h1 className=" text-white font-bold text-5xl  mb-3">File Spliter</h1>
      <div className="flex-col flex w-96 p-5 bg-gray-800 rounded">
        <p className="text-white">Number of lines</p>
        <input
          className="mb-4 p-1 bg-gray-900 rounded border-2 border-gray-400 text-white"
          value={numberOfLines}
          placeholder="Number of lines"
          onChange={(e) => setNumberOfLines(Number(e.target.value) || 0)}
        />
        <p className="text-white">File name</p>
        <input
          type="text"
          className="mb-4 p-1 bg-gray-900 rounded border-2 border-gray-400 text-white"
          placeholder="File name"
          value={fileName}
          onChange={(evt) => setFileName(evt.target.value)}
        />
        <input
          className="mb-4 p-1 text-white"
          onChange={handleFile}
          type="file"
          id="file-selector"
        />
        <button
          className="flex-0 w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={downloadFiles}
        >
          Download
        </button>
      </div>
    </div>
  );
}
