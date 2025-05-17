declare module '@react-three/drei' {
  export const Stars: React.FC<{
    radius?: number;
    depth?: number;
    count?: number;
    factor?: number;
    saturation?: number;
    fade?: boolean;
    speed?: number;
  }>;
}

declare module '@react-three/fiber' {
  export const Canvas: React.FC<{
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }>;
} 