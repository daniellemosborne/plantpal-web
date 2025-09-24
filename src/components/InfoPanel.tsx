import React from "react";
import Header from "./Header";
import LoadingDots from "./LoadingDots";

type InfoPanelProps = {
  text: string;
  plant?: string;
  loading?: boolean;
  error?: string | null;
};

const InfoPanel: React.FC<InfoPanelProps> = ({
  text,
  plant,
  loading = false,
  error = null,
}) => {
  return (
    <div className="info-panel">
      <Header title="plant information" />
      <div className="info-content">
        {loading ? (
            <p style={{ padding: 12 }}>
                <LoadingDots base="Loading" steps={3} interval={400} />
            </p>
        ) : error ? (
            <p>{error}</p>
        ) : text ? (
          <div className="info-body" style={{ padding: 12 }}>
            <h3 className="plant-result-heading">Result: {plant ?? "—"}</h3>
            <p className="plant-info" style={{ whiteSpace: "pre-wrap" }}>{text}</p>
          </div>
        ) : (
            <p>Plant info will appear here!</p>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
