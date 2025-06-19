# @appletosolutions/reactbits

[![npm version](https://img.shields.io/npm/v/@appletosolutions/reactbits?style=flat-square)](https://www.npmjs.com/package/@appletosolutions/reactbits)
[![GitHub stars](https://img.shields.io/github/stars/appletosolutions/reactbits?style=flat-square)](https://github.com/appletosolutions/reactbits)
[![MIT License](https://img.shields.io/github/license/appletosolutions/reactbits?style=flat-square)](./LICENSE)
[![CI](https://github.com/appletosolutions/reactbits/actions/workflows/ci.yml/badge.svg)](https://github.com/appletosolutions/reactbits/actions)

A comprehensive collection of beautiful, performant React animation components. Effortlessly add modern, interactive, and visually stunning animations to your React projects.

---

## ✨ Features
- 40+ ready-to-use animation components
- Simple, declarative API
- Highly customizable (timing, direction, color, etc.)
- Scroll, click, hover, and entrance effects
- TypeScript support
- Built with performance and accessibility in mind

---

## 📦 Installation

```bash
npm install @appletosolutions/reactbits
# or
yarn add @appletosolutions/reactbits
```

---

## 🚀 Usage

Import and use any animation component:

```jsx
import { Bounce, ClickSpark, StarBorder, AnimatedContent, FadeContent } from '@appletosolutions/reactbits';

function Example() {
  return (
    <div>
      <Bounce>
        <h1>Bounce In!</h1>
      </Bounce>
      <ClickSpark>
        <button>Click Me</button>
      </ClickSpark>
      <StarBorder>
        <span>Shiny Border</span>
      </StarBorder>
      <AnimatedContent direction="vertical">
        <p>Slides in on scroll</p>
      </AnimatedContent>
      <FadeContent>
        <p>Fades in smoothly</p>
      </FadeContent>
    </div>
  );
}
```

---

## 🧩 Components

- `Bounce` – Bouncing entrance/exit
- `ClickSpark` – Sparkle effect on click
- `StarBorder` – Animated star border
- `AnimatedContent` – Scroll-triggered slide/scale/fade
- `FadeContent` – Fade in/out with optional blur
- ...and many more! See [Full Component List](https://reactbits.dev/)

---

## 📚 Examples

### Bounce
```jsx
<Bounce>
  <h1>Welcome!</h1>
</Bounce>
```

### ClickSpark
```jsx
<ClickSpark sparkColor="#ffd700" sparkCount={12}>
  <button>Gold Sparks</button>
</ClickSpark>
```

### StarBorder
```jsx
<StarBorder color="#00d4ff" speed="4s">
  <div>Premium Feature</div>
</StarBorder>
```

### AnimatedContent
```jsx
<AnimatedContent direction="horizontal" distance={150}>
  <div>Slides in from left</div>
</AnimatedContent>
```

### FadeContent
```jsx
<FadeContent blur={true} duration={1500}>
  <img src="/hero-image.jpg" alt="Hero" />
</FadeContent>
```

### Advanced Combination
```jsx
<Bounce>
  <FadeContent>
    <ClickSpark>
      <StarBorder>Animated Combo!</StarBorder>
    </ClickSpark>
  </FadeContent>
</Bounce>
```

For more advanced and real-world examples, see the [examples.md](./examples.md) file.

---

## 🎨 Styling

All components are unstyled by default. Use your own CSS or frameworks (e.g., Chakra UI, Tailwind) to style children. See the [examples.md](./examples.md) for CSS tips.

---

## 🏢 About
**Company:** Appleto Solutions  
**Author:** [Appleto Solutions](https://appletosolutions.com)  
**GitHub:** [appletosolutions/reactbits](https://github.com/appletosolutions/reactbits)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
- Fork the repo
- Create your feature branch (`git checkout -b feature/YourFeature`)
- Commit your changes
- Push to the branch
- Open a pull request

---

## 📄 License

MIT 
