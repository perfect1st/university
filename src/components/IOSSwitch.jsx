// src/components/IOSSwitch.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const StyledIOSSwitch = styled(Switch, {
  shouldForwardProp: (prop) => prop !== 'customColor',
})(({ theme, customColor }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: customColor || '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles?.('dark', {
          backgroundColor: customColor || '#2ECA45',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 13,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles?.('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

const IOSSwitch = ({ color, sx, ...props }) => {
  return <StyledIOSSwitch customColor={color} sx={sx} {...props} />;
};

export default IOSSwitch;
