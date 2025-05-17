import React, { useEffect, useRef } from 'react';
import { animate, stagger, svg } from 'animejs';
import { useTheme as useMuiTheme } from '@mui/material';

const AnimatedLogo = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useMuiTheme();
  const color = theme.palette.mode === 'light' ? '#000000' : '#FFFFFF';

  useEffect(() => {
    animate(svg.createDrawable('.line'), {
      draw: ['0 0', '0 1', '1 1'],
      ease: 'inOutQuad',
      duration: 4000,
      delay: stagger(10),
      loop: true
    });
  }, []);

  return (
    <svg ref={svgRef} width="300" height="80" viewBox="0 0 300 80">
      <g stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        {/* E */}
        <path className="line" d="M20 60V20h30v10H30v10h15v10H30v10h20"/>
        {/* V */}
        <path className="line" d="M60 20l15 40 15-40"/>
        {/* E */}
        <path className="line" d="M100 60V20h30v10H110v10h15v10H110v10h20"/>
        {/* N */}
        <path className="line" d="M140 60V20h10l20 30V20h10v40"/>
        {/* T */}
        <path className="line" d="M185 20h30M200 20v40"/>
        {/* L */}
        <path className="line" d="M225 20v40h25"/>
        {/* Y */}
        <path className="line" d="M260 20l15 20v20M290 20l-15 20"/>
      </g>
    </svg>
  );
};

export default AnimatedLogo; 