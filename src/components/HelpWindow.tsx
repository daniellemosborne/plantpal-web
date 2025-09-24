import React, { useEffect, useRef } from "react";
import Header from "./Header";
import Click from "../assets/sounds/buttonclick.mp3";

type HelpWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

const HelpWindow: React.FC<HelpWindowProps> = ({
  isOpen,
  onClose,
  title = "Help",
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    const audio = new Audio(Click);
    audio.currentTime = 0;
    audio.play();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="popup-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="popup-dialog retro-window"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="popup-header retro-titlebar">
          <Header
            title={title}
            right={
              <button
                type="button"
                className="header-btn"
                onClick={handleClick}
                aria-label="Close"
                style={{ fontSize: "14pt" }}
              >
                ×
              </button>
            }
          />
        </div>
        <div className="popup-body">{children}</div>
      </div>
    </div>
  );
};

export default HelpWindow;
