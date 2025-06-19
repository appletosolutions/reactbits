import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  UIEvent,
} from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: "1rem", cursor: "pointer" }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
    "Item 10",
    "Item 11",
    "Item 12",
    "Item 13",
    "Item 14",
    "Item 15",
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <>
      <style>{`.scroll-list-container {
  position: relative;
  width: 500px;
}

.scroll-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
}

.scroll-list::-webkit-scrollbar {
  width: 8px;
}

.scroll-list::-webkit-scrollbar-track {
  background: #060010;
}

.scroll-list::-webkit-scrollbar-thumb {
  background: #271E37;
  border-radius: 4px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.item {
  padding: 16px;
  background-color: #170D27;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item.selected {
  background-color: #271E37;
}

.item-text {
  color: white;
  margin: 0;
}

.top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to bottom, #060010, transparent);
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.bottom-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, #060010, transparent);
  pointer-events: none;
  transition: opacity 0.3s ease;
}`}</style>
      <div className={`scroll-list-container ${className}`}>
        <div
          ref={listRef}
          className={`scroll-list ${!displayScrollbar ? "no-scrollbar" : ""}`}
          onScroll={handleScroll}
        >
          {items.map((item, index) => (
            <AnimatedItem
              key={index}
              delay={0.1}
              index={index}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => {
                setSelectedIndex(index);
                if (onItemSelect) {
                  onItemSelect(item, index);
                }
              }}
            >
              <div
                className={`item ${
                  selectedIndex === index ? "selected" : ""
                } ${itemClassName}`}
              >
                <p className="item-text">{item}</p>
              </div>
            </AnimatedItem>
          ))}
        </div>
        {showGradients && (
          <>
            <div
              className="top-gradient"
              style={{ opacity: topGradientOpacity }}
            ></div>
            <div
              className="bottom-gradient"
              style={{ opacity: bottomGradientOpacity }}
            ></div>
          </>
        )}
      </div>
    </>
  );
};

export default AnimatedList;
