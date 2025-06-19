# ReactBits Animations - Examples

This file contains practical examples of how to use each component in the ReactBits Animations library.

## Basic Usage Examples

### 1. Bounce Component

```jsx
import { Bounce } from 'reactbits-animations';

// Simple bounce animation
function SimpleBouncePage() {
  return (
    <div className="page">
      <Bounce>
        <h1>Welcome to Our Site!</h1>
      </Bounce>
      
      <Bounce>
        <div className="card">
          <h3>Feature Card</h3>
          <p>This card bounces into view</p>
        </div>
      </Bounce>
    </div>
  );
}
```

### 2. ClickSpark Component

```jsx
import { ClickSpark } from 'reactbits-animations';

// Interactive buttons with spark effects
function InteractiveButtons() {
  return (
    <div className="button-container">
      {/* Default sparks */}
      <ClickSpark>
        <button className="btn-primary">Click Me!</button>
      </ClickSpark>
      
      {/* Custom red sparks */}
      <ClickSpark 
        sparkColor="#ff4757" 
        sparkCount={12} 
        sparkRadius={25}
        duration={800}
      >
        <button className="btn-danger">Red Sparks</button>
      </ClickSpark>
      
      {/* Gold sparks with custom easing */}
      <ClickSpark 
        sparkColor="#ffd700" 
        sparkCount={16} 
        sparkSize={15}
        easing="ease-in-out"
        extraScale={1.5}
      >
        <div className="premium-card">
          <h3>Premium Feature</h3>
          <p>Click anywhere on this card!</p>
        </div>
      </ClickSpark>
    </div>
  );
}
```

### 3. StarBorder Component

```jsx
import { StarBorder } from 'reactbits-animations';

// Various star border implementations
function StarBorderExamples() {
  return (
    <div className="star-examples">
      {/* Default button with star border */}
      <StarBorder>
        Get Started
      </StarBorder>
      
      {/* Custom div with blue stars */}
      <StarBorder 
        as="div" 
        color="#00d4ff" 
        speed="4s"
        className="feature-highlight"
      >
        <h3>Premium Feature</h3>
        <p>Highlighted with animated stars</p>
      </StarBorder>
      
      {/* Fast-moving purple stars */}
      <StarBorder 
        color="#8b5cf6" 
        speed="2s"
        className="cta-button"
      >
        Join Now - Limited Time!
      </StarBorder>
    </div>
  );
}
```

### 4. AnimatedContent Component

```jsx
import { AnimatedContent } from 'reactbits-animations';

// Scroll-triggered animations
function ScrollAnimations() {
  return (
    <div className="long-page">
      {/* Slide up from bottom */}
      <AnimatedContent direction="vertical" distance={100}>
        <section className="hero">
          <h1>Slide Up Animation</h1>
          <p>This content slides up when scrolled into view</p>
        </section>
      </AnimatedContent>
      
      {/* Slide in from left */}
      <AnimatedContent 
        direction="horizontal" 
        distance={150} 
        reverse={true}
        duration={1.2}
        ease="power2.out"
      >
        <div className="feature-grid">
          <h2>Features</h2>
          <div className="grid">
            <div className="feature-item">Feature 1</div>
            <div className="feature-item">Feature 2</div>
            <div className="feature-item">Feature 3</div>
          </div>
        </div>
      </AnimatedContent>
      
      {/* Scale and fade animation */}
      <AnimatedContent 
        scale={0.8} 
        duration={0.6}
        threshold={0.3}
        onComplete={() => console.log('Animation completed!')}
      >
        <div className="testimonial">
          <blockquote>
            "This library is amazing!"
          </blockquote>
          <cite>- Happy Developer</cite>
        </div>
      </AnimatedContent>
    </div>
  );
}
```

### 5. FadeContent Component

```jsx
import { FadeContent } from 'reactbits-animations';

// Fade animations with various effects
function FadeExamples() {
  return (
    <div className="fade-examples">
      {/* Simple fade in */}
      <FadeContent>
        <h2>Simple Fade In</h2>
      </FadeContent>
      
      {/* Fade with blur effect */}
      <FadeContent 
        blur={true} 
        duration={1500}
        threshold={0.2}
      >
        <div className="image-container">
          <img src="/hero-image.jpg" alt="Hero" />
          <div className="overlay">
            <h3>Beautiful Image</h3>
            <p>Fades in with blur effect</p>
          </div>
        </div>
      </FadeContent>
      
      {/* Delayed fade with custom easing */}
      <FadeContent 
        delay={500}
        duration={2000}
        easing="ease-in-out"
        initialOpacity={0.2}
      >
        <div className="stats-section">
          <div className="stat">
            <h4>1000+</h4>
            <p>Happy Users</p>
          </div>
          <div className="stat">
            <h4>50+</h4>
            <p>Components</p>
          </div>
        </div>
      </FadeContent>
    </div>
  );
}
```

## Advanced Combinations

### Multi-layered Animation Page

```jsx
import { 
  Bounce, 
  ClickSpark, 
  StarBorder, 
  AnimatedContent, 
  FadeContent 
} from 'reactbits-animations';

function AdvancedAnimationPage() {
  return (
    <div className="advanced-page">
      {/* Header with bounce */}
      <header>
        <Bounce>
          <h1>ReactBits Animations</h1>
        </Bounce>
      </header>
      
      {/* Hero section with multiple effects */}
      <FadeContent blur={true} duration={1000}>
        <section className="hero">
          <AnimatedContent direction="vertical" distance={80}>
            <h2>Create Amazing Animations</h2>
            <p>Build beautiful, interactive React components</p>
            
            <ClickSpark sparkColor="#ff6b6b" sparkCount={10}>
              <StarBorder color="#00d4ff" speed="5s">
                Get Started Now
              </StarBorder>
            </ClickSpark>
          </AnimatedContent>
        </section>
      </FadeContent>
      
      {/* Feature cards with staggered animations */}
      <section className="features">
        {[1, 2, 3].map((item, index) => (
          <AnimatedContent 
            key={item}
            delay={index * 0.2}
            direction="vertical"
            distance={60}
          >
            <FadeContent delay={index * 100}>
              <ClickSpark sparkColor="#ffd700">
                <div className="feature-card">
                  <h3>Feature {item}</h3>
                  <p>Amazing functionality with smooth animations</p>
                </div>
              </ClickSpark>
            </FadeContent>
          </AnimatedContent>
        ))}
      </section>
    </div>
  );
}
```

### Interactive Dashboard

```jsx
import { ClickSpark, StarBorder, FadeContent } from 'reactbits-animations';

function InteractiveDashboard() {
  return (
    <div className="dashboard">
      <FadeContent>
        <header className="dashboard-header">
          <h1>Analytics Dashboard</h1>
        </header>
      </FadeContent>
      
      <div className="dashboard-grid">
        {/* Interactive metric cards */}
        <ClickSpark sparkColor="#10b981" sparkCount={8}>
          <div className="metric-card success">
            <h3>Revenue</h3>
            <p className="metric-value">$125,430</p>
            <span className="metric-change">+12.5%</span>
          </div>
        </ClickSpark>
        
        <ClickSpark sparkColor="#3b82f6" sparkCount={8}>
          <div className="metric-card info">
            <h3>Users</h3>
            <p className="metric-value">8,492</p>
            <span className="metric-change">+5.2%</span>
          </div>
        </ClickSpark>
        
        {/* Premium feature with star border */}
        <StarBorder color="#f59e0b" speed="3s" as="div">
          <div className="premium-metric">
            <h3>Premium Analytics</h3>
            <p>Advanced insights available</p>
            <button>Upgrade Now</button>
          </div>
        </StarBorder>
      </div>
    </div>
  );
}
```

## CSS Styling Tips

```css
/* Custom styles to enhance animations */
.feature-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.metric-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
```

These examples demonstrate the flexibility and power of ReactBits Animations. Mix and match components to create unique, engaging user experiences!
