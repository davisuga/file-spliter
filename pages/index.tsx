import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";

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
  const [originalFile, setOriginalFile] = useState(``);
  const [numberOfLines, setNumberOfLines] = useState(10);
  const [splitFiles, setSplitFiles] = useState<string[][]>([]);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    console.log(files[0].text().then(setOriginalFile));
  };

  const downloadFiles = () => {
    const zip = new JSZip();
    console.log(splitFiles.map(joinFile).map(makeBlob).map(addToZip(zip)));
    zip.generateAsync({ type: "blob" }).then(function (content) {
      // see FileSaver.js
      saveAs(content, "example.zip");
    });
  };

  useEffect(() => {
    const result = splitFileToArray(originalFile, numberOfLines);
    console.log(result);
    originalFile && setSplitFiles(result);
  }, [originalFile, numberOfLines]);

  return (
    <div>
      <h2>Spliter</h2>
      <input
        value={numberOfLines}
        onChange={(e) => setNumberOfLines(Number(e.target.value) || 0)}
      />

      <input onChange={handleFile} type="file" id="file-selector" />
      <button onClick={downloadFiles}>Download stuff</button>
    </div>
  );
}
