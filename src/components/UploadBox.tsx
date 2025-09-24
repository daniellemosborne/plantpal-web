import React, { useState } from "react";
import Header from "./Header";
import Click from "../assets/sounds/buttonclick.mp3";
import trashIcon from "../assets/trash_icon.png";
import sampleImg from "../assets/sample_img.jpg";
import { ClassificationResult } from "../App";

interface UploadBoxProps {
  onClassify: (result: ClassificationResult, previewUrl: string | null) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const API = (import.meta as any).env?.VITE_API_URL as string | undefined;

async function classifyViaServer(file: File): Promise<ClassificationResult> {
  if (!API) throw new Error("VITE_API_URL is not set");
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API}/predict`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

const UploadBox: React.FC<UploadBoxProps> = ({ onClassify, setLoading, setProgress }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function animateTo(finalConfidencePct: number, done: () => void) {
    let current = 0;
    setProgress(0);
    const id = setInterval(() => {
      current += 5;
      if (current >= finalConfidencePct) {
        clearInterval(id);
        setProgress(finalConfidencePct);
        done();
      } else {
        setProgress(current);
      }
    }, 200);
  }

  const playClick = () => {
    const audio = new Audio(Click);
    audio.currentTime = 0;
    audio.play();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };

  const handleClick = async () => {
    playClick();
    if (!selectedFile) {
      setTimeout(() => alert("Please upload an image first."), 100);
      return;
    }
    try {
      setLoading(true);
      setProgress(0);
      const result = await classifyViaServer(selectedFile);
      console.log("Prediction result:", result);
      const finalConfidence = Math.round((result.confidence ?? 0) * 100);
      animateTo(finalConfidence, () => setLoading(false));
      onClassify(result, previewUrl);
    } catch (err) {
      console.error("Error classifying image.", err);
      alert(`Error: ${String((err as Error)?.message || err)}`);
      setLoading(false);
    }
  };

  const handleSampleClick = async () => {
    playClick();
    try {
      const res = await fetch(sampleImg);
      const blob = await res.blob();
      const file = new File([blob], "sample_img.jpeg", { type: "image/jpeg" });

      setSelectedFile(file);
      setFileName("sample_img.jpeg");
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      setLoading(true);
      setProgress(0);

      const result = await classifyViaServer(file);
      console.log("Sample prediction result:", result);
      const finalConfidence = Math.round((result.confidence ?? 0) * 100);
      animateTo(finalConfidence, () => setLoading(false));
      onClassify(result, preview);
    } catch (err) {
      console.error("Error with sample image.", err);
      alert(`Error: ${String((err as Error)?.message || err)}`);
      setLoading(false);
    }
  };

  const handleClear = () => {
    playClick();
    if (!selectedFile) {
      setTimeout(() => alert("Please upload an image first."), 100);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setFileName(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="upload-box">
      <Header
        title="upload image"
        right={
          <button type="button" className="header-btn" onClick={handleClear}>
            <img className="trash-icon" src={trashIcon} alt="Delete upload" title="Delete upload" style={{ width: "12px", height: "17px" }} />
          </button>
        }
      />
      <div className="upload-content">
        <div
          className={`dragdrop-border ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
            {fileName ? <p className="img-uploadtext">Uploaded: {fileName}</p> : <p className="img-upload">Drag & drop a file here, or click to select</p>}
            {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}
          </label>
        </div>
      </div>
      <div className="uploadbox-button">
        <button className="classifyimage-button" onClick={handleClick}>Classify Image</button>
        <button className="classifyimage-button" onClick={handleSampleClick}>Use Sample Image</button>
      </div>
    </div>
  );
};

export default UploadBox;
