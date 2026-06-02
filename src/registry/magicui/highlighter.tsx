"use client";

import React, { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotationType } from "rough-notation/lib/model";

interface HighlighterProps {
  children: React.ReactNode;
  color?: string;
  action?: "highlight" | "circle" | "box" | "bracket" | "crossed-off" | "strike-through" | "underline";
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
  delay?: number;
  textColor?: string;
}

export function Highlighter({
  children,
  color = "#ffd1dc",
  action = "highlight",
  strokeWidth = 1.5,
  animationDuration = 500,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  delay = 0,
  textColor
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<any>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  useEffect(() => {
    if (!elementRef.current) return;
    const el = elementRef.current;

    const typeMap: Record<string, RoughAnnotationType> = {
      "highlight": "highlight",
      "circle": "circle",
      "box": "box",
      "bracket": "bracket",
      "crossed-off": "crossed-off",
      "strike-through": "strike-through",
      "underline": "underline"
    };

    const makeAnnotation = (withAnimation: boolean) => annotate(el, {
      type: typeMap[action],
      color,
      strokeWidth,
      animationDuration: withAnimation ? animationDuration : 0,
      iterations,
      padding,
      multiline
    });

    let annotation = makeAnnotation(true);
    annotationRef.current = annotation;
    let hasShown = false;

    // When the page layout shifts (e.g. an accordion above expands), the
    // rough-notation SVG stays at its original position. Watch body height
    // changes and reposition instantly without re-animating.
    const bodyObserver = new ResizeObserver(() => {
      if (!hasShown) return;
      annotation.remove();
      annotation = makeAnnotation(false);
      annotationRef.current = annotation;
      annotation.show();
    });
    bodyObserver.observe(document.body);

    if (isView) {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => {
              setIsAnimating(true);
              annotation.show();
              hasShown = true;
            }, delay);
            intersectionObserver.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      if (el) intersectionObserver.observe(el);

      return () => {
        intersectionObserver.disconnect();
        bodyObserver.disconnect();
        annotation.remove();
      };
    } else {
      const timeoutId = setTimeout(() => {
        setIsAnimating(true);
        annotation.show();
        hasShown = true;
      }, delay);

      return () => {
        clearTimeout(timeoutId);
        bodyObserver.disconnect();
        annotation.remove();
      };
    }
  }, [color, action, strokeWidth, animationDuration, iterations, padding, multiline, isView, delay]);

  return (
    <span
      ref={elementRef}
      style={{
        transition: textColor ? `color ${animationDuration}ms ease-in-out` : undefined,
        color: isAnimating && textColor ? textColor : undefined
      }}
    >
      {children}
    </span>
  );
}
