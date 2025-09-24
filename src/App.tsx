// src/App.tsx
import React, { useState } from "react";
import ResultCard from "./components/ResultCard";
import UploadBox from "./components/UploadBox";
import InfoPanel from "./components/InfoPanel";
import { getPlantInfo } from "./data/plantInfoMap";
import "./App.css";

export type ClassificationResult = {
  predicted_class: string;
  confidence: number;
  unknown?: boolean;
  candidates?: { class: string; prob: number }[];
};

const MIN_LOADING_MS = 2500;

export default function App() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [infoText, setInfoText] = useState("");
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);

  const handleClassify = (result: ClassificationResult, preview: string | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setClassification(result);
    setPreviewUrl(preview);
    setInfoText("");
    setInfoError(null);
  };

  const handleShowInfo = async (plant: string) => {
    setInfoLoading(true);
    setInfoError(null);
    try {
      const started = Date.now();
      const text = getPlantInfo(plant);
      const elapsed = Date.now() - started;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
      setInfoText(text);
    } catch (e: any) {
      setInfoError(e.message || "Something went wrong");
    } finally {
      setInfoLoading(false);
    }
  };

  return (
    <div className="app-grid">
      <ResultCard
        result={classification}
        image={previewUrl}
        progress={progress}
        loading={loading}
        onShowInfo={handleShowInfo}
      />
      <div className="right-column">
        <UploadBox
          onClassify={handleClassify}
          setLoading={setLoading}
          setProgress={setProgress}
        />
        <InfoPanel
          text={infoText}
          plant={classification?.predicted_class || ""}
          loading={infoLoading}
          error={infoError}
        />
      </div>
    </div>
  );
}
