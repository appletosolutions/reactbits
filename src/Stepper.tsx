import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
  ReactNode,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: RenderStepIndicatorProps) => ReactNode;
}

interface RenderStepIndicatorProps {
  step: number;
  currentStep: number;
  onStepClick: (clicked: number) => void;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <>
      {" "}
      <style>{`.outer-container {
  display: flex;
  min-height: 100%;
  flex: 1 1 0%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

@media (min-width: 640px) {
  .outer-container {
    aspect-ratio: 4 / 3;
  }
}

@media (min-width: 768px) {
  .outer-container {
    aspect-ratio: 2 / 1;
  }
}

.step-circle-container {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 28rem;
  border-radius: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.step-indicator-row {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 2rem;
}

.step-content-default {
  position: relative;
  overflow: hidden;
}

.step-default {
  padding-left: 2rem;
  padding-right: 2rem;
}

.footer-container {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
}

.footer-nav {
  margin-top: 2.5rem;
  display: flex;
}

.footer-nav.spread {
  justify-content: space-between;
}

.footer-nav.end {
  justify-content: flex-end;
}

.back-button {
  transition: all 350ms;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  color: #a3a3a3;
  cursor: pointer;
}

.back-button:hover {
  color: #52525b;
}

.back-button.inactive {
  pointer-events: none;
  opacity: 0.5;
  color: #a3a3a3;
}

.next-button {
  transition: all 350ms;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #5227FF;
  color: #fff;
  font-weight: 500;
  letter-spacing: -0.025em;
  padding: 0.375rem 0.875rem;
  cursor: pointer;
}

.next-button:hover {
  background-color: #5227FF;
}

.next-button:active {
  background-color: #5227FF;
}

.step-indicator {
  position: relative;
  cursor: pointer;
  outline: none;
}

.step-indicator-inner {
  display: flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 600;
}

.active-dot {
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 9999px;
  background-color: #fff;
}

.step-number {
  font-size: 0.875rem;
}

.step-connector {
  position: relative;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  height: 0.125rem;
  flex: 1;
  overflow: hidden;
  border-radius: 0.25rem;
  background-color: #52525b;
}

.step-connector-inner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.check-icon {
  height: 1rem;
  width: 1rem;
  color: #fff;
}`}</style>{" "}
      <div className="outer-container" {...rest}>
        <div
          className={`step-circle-container ${stepCircleContainerClassName}`}
          style={{ border: "1px solid #222" }}
        >
          <div className={`step-indicator-row ${stepContainerClassName}`}>
            {stepsArray.map((_, index) => {
              const stepNumber = index + 1;
              const isNotLastStep = index < totalSteps - 1;
              return (
                <React.Fragment key={stepNumber}>
                  {renderStepIndicator ? (
                    renderStepIndicator({
                      step: stepNumber,
                      currentStep,
                      onStepClick: (clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      },
                    })
                  ) : (
                    <StepIndicator
                      step={stepNumber}
                      disableStepIndicators={disableStepIndicators}
                      currentStep={currentStep}
                      onClickStep={(clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      }}
                    />
                  )}
                  {isNotLastStep && (
                    <StepConnector isComplete={currentStep > stepNumber} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={`step-content-default ${contentClassName}`}
          >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>

          {!isCompleted && (
            <div className={`footer-container ${footerClassName}`}>
              <div
                className={`footer-nav ${currentStep !== 1 ? "spread" : "end"}`}
              >
                {currentStep !== 1 && (
                  <button
                    onClick={handleBack}
                    className={`back-button ${
                      currentStep === 1 ? "inactive" : ""
                    }`}
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </button>
                )}
                <button
                  onClick={isLastStep ? handleComplete : handleNext}
                  className="next-button"
                  {...nextButtonProps}
                >
                  {isLastStep ? "Complete" : nextButtonText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return <div className="step-default">{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}: StepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="step-indicator"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: "#222", color: "#a3a3a3" },
          active: { scale: 1, backgroundColor: "#5227FF", color: "#5227FF" },
          complete: { scale: 1, backgroundColor: "#5227FF", color: "#3b82f6" },
        }}
        transition={{ duration: 0.3 }}
        className="step-indicator-inner"
      >
        {status === "complete" ? (
          <CheckIcon className="check-icon" />
        ) : status === "active" ? (
          <div className="active-dot" />
        ) : (
          <span className="step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: "#5227FF" },
  };

  return (
    <div className="step-connector">
      <motion.div
        className="step-connector-inner"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
