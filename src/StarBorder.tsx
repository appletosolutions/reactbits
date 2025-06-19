import React from "react";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties["animationDuration"];
  };

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";

  return (
    <>
      <style>{`
          .star-border-container {
            display: inline-block;
            padding: 1px 0;
            position: relative;
            border-radius: 20px;
            overflow: hidden;
          }
          
          .border-gradient-bottom {
            position: absolute;
            width: 300%;
            height: 50%;
            opacity: 0.7;
            bottom: -11px;
            right: -250%;
            border-radius: 50%;
            animation: star-movement-bottom linear infinite alternate;
            z-index: 0;
          }
          
          .border-gradient-top {
            position: absolute;
            opacity: 0.7;
            width: 300%;
            height: 50%;
            top: -10px;
            left: -250%;
            border-radius: 50%;
            animation: star-movement-top linear infinite alternate;
            z-index: 0;
          }
          
          .inner-content {
            position: relative;
            border: 1px solid #222;
            background: #000;
            color: white;
            font-size: 16px;
            text-align: center;
            padding: 16px 26px;
            border-radius: 20px;
            z-index: 1;
          }
          
          @keyframes star-movement-bottom {
            0% {
              transform: translate(0%, 0%);
              opacity: 1;
            }
            100% {
              transform: translate(-100%, 0%);
              opacity: 0;
            }
          }
          
          @keyframes star-movement-top {
            0% {
              transform: translate(0%, 0%);
              opacity: 1;
            }
            100% {
              transform: translate(100%, 0%);
              opacity: 0;
            }
          }
      `}</style>
          {React.createElement(
        Component,
        { className: `star-border-container ${className}`, ...rest },
        <div
          className="border-gradient-bottom"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 10%)`,
            animationDuration: speed,
          }}
        ></div>,
        <div
          className="border-gradient-top"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 10%)`,
            animationDuration: speed,
          }}
        ></div>,
        <div className="inner-content">{children}</div>
      )}
    </>
  );
};

export default StarBorder;
