import { useEffect, useState, useRef } from "react";
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  Transition,
} from "framer-motion";
// replace icons with your own if needed
import {
  FiCircle,
  FiCode,
  FiFileText,
  FiLayers,
  FiLayout,
} from "react-icons/fi";

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactElement;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: "Text Animations",
    description: "Cool text animations for your projects.",
    id: 1,
    icon: <FiFileText className="carousel-icon" />,
  },
  {
    title: "Animations",
    description: "Smooth animations for your projects.",
    id: 2,
    icon: <FiCircle className="carousel-icon" />,
  },
  {
    title: "Components",
    description: "Reusable components for your projects.",
    id: 3,
    icon: <FiLayers className="carousel-icon" />,
  },
  {
    title: "Backgrounds",
    description: "Beautiful backgrounds and patterns for your projects.",
    id: 4,
    icon: <FiLayout className="carousel-icon" />,
  },
  {
    title: "Common UI",
    description: "Common UI components are coming soon!",
    id: 5,
    icon: <FiCode className="carousel-icon" />,
  },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}: CarouselProps): React.JSX.Element {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    loop,
    items.length,
    carouselItems.length,
    pauseOnHover,
  ]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  return (
    <>
      <style>{`.carousel-container {
  position: relative;
  overflow: hidden;
  border: 1px solid #555;
  border-radius: 24px;
  padding: 16px;
  --outer-r: 24px;
  --p-distance: 12px;
}

.carousel-track {
  display: flex;
}

.carousel-item {
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border: 1px solid #555;
  border-radius: calc(var(--outer-r) - var(--p-distance));
  background-color: #0D0716;
  overflow: hidden;
  cursor: grab;
}

.carousel-item:active {
  cursor: grabbing;
}

.carousel-container.round {
  border: 1px solid #555;
}

.carousel-item.round {
  background-color: #0D0716;
  position: relative;
  bottom: .1em;
  border: 1px solid #555;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.carousel-item-header.round {
  padding: 0;
  margin: 0;
}

.carousel-indicators-container.round {
  position: absolute;
  z-index: 2;
  bottom: 3em;
  left: 50%;
  transform: translateX(-50%);
}

.carousel-indicator.active {
  background-color: #333333;
}

.carousel-indicator.inactive {
  background-color: rgba(51, 51, 51, 0.4);
}

.carousel-item-header {
  margin-bottom: 16px;
  padding: 20px;
  padding-top: 20px;
}

.carousel-icon-container {
  display: flex;
  height: 28px;
  width: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #fff;
}

.carousel-icon {
  height: 16px;
  width: 16px;
  color: #060010;
}

.carousel-item-content {
  padding: 20px;
  padding-bottom: 20px;
}

.carousel-item-title {
  margin-bottom: 4px;
  font-weight: 900;
  font-size: 18px;
  color: #fff;
}

.carousel-item-description {
  font-size: 14px;
  color: #fff;
}

.carousel-indicators-container {
  display: flex;
  width: 100%;
  justify-content: center;
}

.carousel-indicators {
  margin-top: 16px;
  display: flex;
  width: 150px;
  justify-content: space-between;
  padding: 0 32px;
}

.carousel-indicator {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 150ms;
}

.carousel-indicator.active {
  background-color: #fff;
}

.carousel-indicator.inactive {
  background-color: #555;
}`}</style>
      <div
        ref={containerRef}
        className={`carousel-container ${round ? "round" : ""}`}
        style={{
          width: `${baseWidth}px`,
          ...(round && { height: `${baseWidth}px`, borderRadius: "50%" }),
        }}
      >
        <motion.div
          className="carousel-track"
          drag="x"
          {...dragProps}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${
              currentIndex * trackItemOffset + itemWidth / 2
            }px 50%`,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(currentIndex * trackItemOffset) }}
          transition={effectiveTransition}
          onAnimationComplete={handleAnimationComplete}
        >
          {carouselItems.map((item, index) => {
            const range = [
              -(index + 1) * trackItemOffset,
              -index * trackItemOffset,
              -(index - 1) * trackItemOffset,
            ];
            const outputRange = [90, 0, -90];
            const rotateY = useTransform(x, range, outputRange, {
              clamp: false,
            });
            return (
              <motion.div
                key={index}
                className={`carousel-item ${round ? "round" : ""}`}
                style={{
                  width: itemWidth,
                  height: round ? itemWidth : "100%",
                  rotateY: rotateY,
                  ...(round && { borderRadius: "50%" }),
                }}
                transition={effectiveTransition}
              >
                <div className={`carousel-item-header ${round ? "round" : ""}`}>
                  <span className="carousel-icon-container">{item.icon}</span>
                </div>
                <div className="carousel-item-content">
                  <div className="carousel-item-title">{item.title}</div>
                  <p className="carousel-item-description">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <div
          className={`carousel-indicators-container ${round ? "round" : ""}`}
        >
          <div className="carousel-indicators">
            {items.map((_, index) => (
              <motion.div
                key={index}
                className={`carousel-indicator ${
                  currentIndex % items.length === index ? "active" : "inactive"
                }`}
                animate={{
                  scale: currentIndex % items.length === index ? 1.2 : 1,
                }}
                onClick={() => setCurrentIndex(index)}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
