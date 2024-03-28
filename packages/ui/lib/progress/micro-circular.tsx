import React from "react";

interface MicroCircularProps {
  value: number;
  radius?: number;
  className?: string;
  strokeWidth?: number;
  showValue?: boolean;
}

const MicroCircular: React.FC<MicroCircularProps> = ({
  value,
  className = "",
  radius = 8,
  strokeWidth = 2,
  showValue = false,
}) => {
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const remaining = circumference - progress;
  const width = radius * 2 + strokeWidth * 2;

  return (
    <div className={className}>
      <div className="relative">
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
        {showValue && (
          <div className="text-2xs absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform font-semibold ">
            {value.toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MicroCircular;
