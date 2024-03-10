import React from "react";

interface MicroCircularProps {
  value: number;
  radius?: number;
  className?: string;
  strokeWidth?: number;
}

const MicroCircular: React.FC<MicroCircularProps> = ({
  value,
  className = "",
  radius = 8,
  strokeWidth = 2,
}) => {
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const remaining = circumference - progress;
  const width = radius * 2 + strokeWidth * 2;

  return (
    <div className={className}>
      <svg height={width} width={width}>
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="transparent"
          stroke="#ccc"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${remaining}`}
          className="transition-all duration-500"
          transform={`rotate(-90 ${radius + strokeWidth} ${
            radius + strokeWidth
          })`}
        />
      </svg>
    </div>
  );
};

export default MicroCircular;
