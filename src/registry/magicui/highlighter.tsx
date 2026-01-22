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

    // Map action names to RoughNotation type names
    const typeMap: Record<string, RoughAnnotationType> = {
      "highlight": "highlight",
      "circle": "circle",
      "box": "box",
      "bracket": "bracket",
      "crossed-off": "crossed-off",
      "strike-through": "strike-through",
      "underline": "underline"
    };

    const annotation = annotate(elementRef.current, {
      type: typeMap[action],
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline
    });

    annotationRef.current = annotation;

    if (isView) {
      // Use IntersectionObserver to trigger animation when in view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && annotationRef.current) {
              setTimeout(() => {
                if (annotationRef.current) {
                  setIsAnimating(true);
                  annotationRef.current.show();
                }
              }, delay);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => {
        observer.disconnect();
      };
    } else {
      // Show annotation with delay
      const timeoutId = setTimeout(() => {
        if (annotationRef.current) {
          setIsAnimating(true);
          annotationRef.current.show();
        }
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {
      if (annotationRef.current) {
        annotationRef.current.remove();
      }
    };
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
