// src/Bounce.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Bounce: React.FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        animation: "bounce 2s infinite",
      }}
    >
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
      {children}
    </div>
  );
};

export default Bounce;
