import React from "react";
import { gsap } from "gsap";

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  return (
    <div className="menu-wrap">
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image }) => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement>(null);

  const animationDefaults: gsap.TweenVars = { duration: 0.6, ease: "expo" };

  const distMetric = (x: number, y: number, x2: number, y2: number): number => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): "top" | "bottom" => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    const tl = gsap.timeline({ defaults: animationDefaults });

    tl.set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    const tl = gsap.timeline({ defaults: animationDefaults });

    tl.to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0).to(
      marqueeInnerRef.current,
      { y: edge === "top" ? "101%" : "-101%" },
      0
    );
  };

  const repeatedMarqueeContent = React.useMemo(() => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <React.Fragment key={idx}>
        <span>{text}</span>
        <div
          className="marquee__img"
          style={{ backgroundImage: `url(${image})` }}
        />
      </React.Fragment>
    ));
  }, [text, image]);

  return (
    <>
      <style>{`.menu-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
}

.menu__item {
  flex: 1;
  position: relative;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 -1px #fff;
}

.menu__item-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  font-weight: 600;
  color: #fff;
  font-size: 4vh;
}

.menu__item-link:hover {
  color: #060010;
}

.menu__item-link:focus:not(:focus-visible) {
  color: #fff;
}

.marquee {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: #fff;
  transform: translate3d(0, 101%, 0);
  transition: transform 0.6s ease-expo;
}

.marquee__inner-wrap {
  height: 100%;
  width: 200%;
  display: flex;
  transform: translateX(0);
}

.marquee__inner {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  width: 200%;
  will-change: transform;
  animation: marquee 15s linear infinite;
}

.marquee span {
  color: #060010;
  white-space: nowrap;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 4vh;
  line-height: 1.2;
  padding: 1vh 1vw 0;
}

.marquee__img {
  width: 200px;
  height: 7vh;
  margin: 2em 2vw;
  padding: 1em 0;
  border-radius: 50px;
  background-size: cover;
  background-position: 50% 50%;
}

.menu__item-link:hover+.marquee {
  transform: translate3d(0, 0%, 0);
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}`}</style>
      <div className="menu__item" ref={itemRef}>
        <a
          className="menu__item-link"
          href={link}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {text}
        </a>
        <div className="marquee" ref={marqueeRef}>
          <div className="marquee__inner-wrap" ref={marqueeInnerRef}>
            <div className="marquee__inner" aria-hidden="true">
              {repeatedMarqueeContent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlowingMenu;
