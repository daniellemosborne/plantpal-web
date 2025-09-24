import React from "react";

interface HeaderProps {
    title: string;
    right?: React.ReactNode; // right side button optional
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, right, className }) => {
    return (
        <div className={`window-header ${className ?? ""}`}>
            <span className="window-header__title">{title}</span>
            {right ? <div className="window-header__right">{right}</div> : null}
      </div>
    );
};

export default Header;