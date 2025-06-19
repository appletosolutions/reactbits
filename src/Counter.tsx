import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";


interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });
  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace);
  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);
  return (
    <div className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: number[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = "white",
  fontWeight = "bold",
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = "black",
  gradientTo = "transparent",
  topGradientStyle,
  bottomGradientStyle,
}: CounterProps) {
  const height = fontSize + padding;
  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    gap: gap,
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight: fontWeight,
  };
  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };
  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };
  return (
    <>
      <style>{`.counter-container {
  position: relative;
  display: inline-block;
}

.counter-counter {
  display: flex;
  overflow: hidden;
  line-height: 1;
}

.counter-digit {
  position: relative;
  width: 1ch;
  font-variant-numeric: tabular-nums;
}

.counter-number {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gradient-container {
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.bottom-gradient {
  position: absolute;
  bottom: 0;
  width: 100%;
}`}</style>
      <div className="counter-container" style={containerStyle}>
        <div
          className="counter-counter"
          style={{ ...defaultCounterStyle, ...counterStyle }}
        >
          {places.map((place) => (
            <Digit
              key={place}
              place={place}
              value={value}
              height={height}
              digitStyle={digitStyle}
            />
          ))}
        </div>
        <div className="gradient-container">
          <div
            className="top-gradient"
            style={
              topGradientStyle ? topGradientStyle : defaultTopGradientStyle
            }
          ></div>
          <div
            className="bottom-gradient"
            style={
              bottomGradientStyle
                ? bottomGradientStyle
                : defaultBottomGradientStyle
            }
          ></div>
        </div>
      </div>
    </>
  );
}
