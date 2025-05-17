declare module 'framer-motion' {
  import * as React from 'react';

  export interface AnimationProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    style?: React.CSSProperties;
    className?: string;
    whileHover?: any;
    whileTap?: any;
  }

  export interface MotionProps extends AnimationProps {
    children?: React.ReactNode;
  }

  export const motion: {
    div: React.FC<MotionProps>;
    section: React.FC<MotionProps>;
    button: React.FC<MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>;
  };

  export const useMotionValue: (initialValue: any) => {
    get: () => any;
    set: (value: any) => void;
  };

  export const useMotionTemplate: (strings: TemplateStringsArray, ...values: any[]) => any;

  export const animate: (
    value: any,
    keyframes: any[],
    options?: {
      ease?: string;
      duration?: number;
      repeat?: number;
      repeatType?: string;
    }
  ) => void;
} 