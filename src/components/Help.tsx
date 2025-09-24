import React from "react";
import Header from "./Header";
import HelpWindow from "./HelpWindow";
import plantIcon from '../assets/plant_icon.png';


const Help: React.FC = () => {

    return (
        <div className="help-panel">
            <div className="help-content">
                <h1 className="help-title">How Plant Pal Works</h1>
                <h2 className="help-subtitle">Follow the steps below to identify your image!</h2>
                <div className="instruction-list">
                    <p className="instruction1">
                        <img className="plant-icon" src={plantIcon} alt="Plant Icon"style={{ width: "15px", height: "13px" }} />
                        Click <strong>Get Started</strong> to upload an image.
                    </p>
                    <p className="instruction1">
                        <img className="plant-icon" src={plantIcon} alt="Plant Icon"style={{ width: "15px", height: "13px" }} />
                        You can also upload an image by dragging or clicking inside <strong>upload image</strong> window.
                    </p>
                    <p className="instruction2">
                        <img className="plant-icon" src={plantIcon} alt="Plant Icon"style={{ width: "15px", height: "13px" }} />
                        Use <strong>Sample Image</strong> button to try the demo!
                    </p>
                    <p className="instruction3">
                        <img className="plant-icon" src={plantIcon} alt="Plant Icon"style={{ width: "15px", height: "13px" }} />
                        <strong>Classify Image</strong> and wait for the result!
                    </p>
                    <p className="instruction4">
                        <img className="plant-icon" src={plantIcon} alt="Plant Icon"style={{ width: "15px", height: "13px" }} />
                        Click <strong>More Info</strong> to view info about your plant.
                    </p>
                    <p className="disclaimers"><strong>***Disclaimer:</strong></p>
                    <p className="disclaimer1">Plant Pal makes best-guess identifications and may be wrong. It recognizes 30 plant categories (mostly common fruits and vegetables). Photos outside these classes may be misidentified or shown as “Not sure.” Results vary with photo quality and look-alike species.  
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Help;
 