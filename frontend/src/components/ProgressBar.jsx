import { useState, useEffect } from 'react';

const ProgressBar = ({ label, value, maxValue = 10, color = "#10b981", delay = 0 }) => {
    const [width, setWidth] = useState(0);
    const percentage = (value / maxValue) * 100;

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth(percentage);
        }, delay);
        return () => clearTimeout(timer);
    }, [percentage, delay]);

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-header">
                <span className="progress-label">{label}</span>
                <span className="progress-value">{value}/{maxValue}</span>
            </div>
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                        transition: 'width 1s ease-out'
                    }}
                >
                    <div className="progress-bar-glow"></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
