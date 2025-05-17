import React from 'react';
import { styled, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const StyledLink = styled(RouterLink)(({ theme }) => ({
  flexGrow: 1,
  textDecoration: 'none',
  color: theme.palette.mode === 'light' ? '#000000' : 'inherit',
  fontWeight: 'bold',
  letterSpacing: '1px'
}));

const TitleText = styled('div')(({ theme }) => ({
  display: 'inline-block',
  fontSize: theme.typography.h6.fontSize,
  fontFamily: theme.typography.h6.fontFamily,
  whiteSpace: 'nowrap',
  color: theme.palette.mode === 'light' ? '#000000' : 'inherit'
}));

const AnimatedTitle = () => {
  const theme = useTheme();

  return (
    <StyledLink to="/">
      <TitleText>
        Evently
      </TitleText>
    </StyledLink>
  );
};

export default AnimatedTitle; 