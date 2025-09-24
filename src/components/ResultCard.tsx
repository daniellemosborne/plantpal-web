import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import HelpWindow from "./HelpWindow";
import Help from "./Help";
import Click from "../assets/sounds/buttonclick.mp3";
import { getPlantImage } from "../data/plantImageMap";
import type { ClassificationResult } from "../App";
import LoadingDots from "./LoadingDots";

interface ResultCardProps {
  progress: number;
  loading: boolean;
  result: ClassificationResult | null;
  image: string | null;
  onShowInfo: (plant: string) => void;
}

const numFromPath = (p: string) => {
  const m = p.match(/(\d+)\.png$/);
  return m ? parseInt(m[1], 10) : 0;
};

const ResultCard: React.FC<ResultCardProps> = ({
  progress,
  loading,
  result,
  image,
  onShowInfo,
}) => {
  // animation frames
  const frames = useMemo(() => {
    const modules = import.meta.glob("../assets/animations/*.png", {
      eager: true,
      import: "default",
    }) as Record<string, string>;
    return Object.entries(modules)
      .sort(([a, b]) => numFromPath(a) - numFromPath(b))
      .map(([, url]) => url);
  }, []);

  const [frameIdx, setFrameIdx] = useState(0);
  const LOOP_MS = 1200;

  useEffect(() => {
    if (!loading || frames.length === 0) {
      setFrameIdx(0);
      return;
    }
    const frameMs = Math.max(60, Math.round(LOOP_MS / frames.length));
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % frames.length;
      setFrameIdx(i);
    }, frameMs);
    return () => clearInterval(id);
  }, [loading, frames.length]);

  const [helpOpen, setHelpOpen] = useState(false);

  const playClick = () => {
    const audio = new Audio(Click);
    audio.currentTime = 0;
    audio.play();
  };

  const handleShowInfo = () => {
    if (!result?.predicted_class) return;
    playClick();
    onShowInfo(result.predicted_class);
  };

  const handleGetStarted = () => {
    playClick();
    const input = document.getElementById("fileInput") as HTMLInputElement | null;
    if (input) input.click();
  };

  const titleText = result?.predicted_class ?? "Upload an image!";

  const CLIENT_CONF_THRESHOLD = 0.45;
  const isUnknown =
    !!result &&
    (result.unknown === true ||
      result.predicted_class === "Unknown" ||
      result.confidence < CLIENT_CONF_THRESHOLD);

  return (
    <div className="result-card">
      <Header
        title="identifymyplant.exe"
        right={
          <>
            <button
              type="button"
              className="header-btn"
              onClick={() => {
                playClick();
                setHelpOpen(true);
              }}
              aria-label="Open help"
              title="Open Help"
              style={{ fontSize: "14pt" }}
            >
              ?
            </button>

            <HelpWindow
              isOpen={helpOpen}
              onClose={() => setHelpOpen(false)}
              title="How to use Plant Pal"
            >
              <Help />
            </HelpWindow>
          </>
        }
      />

      <div className="result-content">
        <div className="header">
          <h1 className="pagetitle">PLANT PAL</h1>
          <p className="about">IDENTIFY YOUR PLANTS USING IMAGE CLASSIFICATION</p>
        </div>

        <div className="plantmatch">
          {loading ? (
            // ---------------- Loading ----------------
            <div className="loading-block">
              <p className="loading-text">
                <LoadingDots base="Classifying" steps={3} interval={400} />
              </p>
              {frames.length > 0 && (
                <img
                  src={frames[frameIdx]}
                  alt="Classifying plant..."
                  className="dancing-plant"
                />
              )}
            </div>
          ) : isUnknown ? (
            // ---------------- Unknown ----------------
            <div className="unknown-row">
              <div className="unknown-image-wrapper">
                <img
                  src={getPlantImage("Unknown")}
                  alt="Unknown plant"
                  className="unknown-img"  // fixed typo
                />
              </div>

              <div className="unknown-plant">
                <h2 className="unknown-title">Hmm… couldn’t identify</h2>
                <p className="unknown-confidence-label">
                  Confidence was only {Math.round((result?.confidence ?? 0) * 100)}%
                </p>

                {/* closest matches */}
                {result?.candidates?.length ? (
                  <div className="candidates">
                    <p className="candidates-title">Closest matches:</p>
                    <ul className="candidates-list">
                      {result.candidates.map((c, i) => (
                        <li key={i}>
                          {c.class} <span className="cand-prob">({Math.round(c.prob * 100)}%)</span>
                        </li>
                      ))}
                    </ul>
                </div>
              ) : null}

            </div>
          </div>
          ) : (
            // ---------------- Identified ----------------
            <div className="plant-row">
              {result?.predicted_class && (
                <img
                  src={getPlantImage(result.predicted_class)}
                  alt={result.predicted_class}
                  className="plant-img"
                />
              )}
              <div className="plant-details">
                {!result ? (
                  <h2 aria-label={titleText} className="plant-title wave">
                    {titleText.split("").map((ch, i) => (
                      <span key={i} style={{ ["--i" as any]: i }}>
                        {ch === " " ? "\u00A0" : ch}
                      </span>
                    ))}
                  </h2>
                ) : (
                  <h2 className="plant-title">{titleText}</h2>
                )}

                {!result && !loading && (
                  <button className="getstarted-button" onClick={handleGetStarted}>
                    Get Started
                  </button>
                )}

                {result && (
                  <div className="confidence-section">
                    <p className="confidence-label">With {progress}% Confidence</p>
                    <div className="progress-wrapper">
                      {Array.from({ length: 20 }).map((_, index) => (
                        <div
                          key={index}
                          className={`progress-segment ${
                            index < Math.floor(progress / 5) ? "filled" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {!loading && result?.predicted_class && !isUnknown && (
        <div className="resultcard-button">
          <button className="showinfo-button" onClick={handleShowInfo}>
            Show Info
          </button>
        </div>
      )}

    </div>
  );
};

export default ResultCard;
