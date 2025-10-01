import React from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

// Default styling for RTL TextField
const defaultRtlSx = {
  direction: 'rtl',
    '& .MuiOutlinedInput-root .MuiSelect-icon': {
    insetInlineEnd: 'auto !important',  // unset the default left-hand positioning
    insetInlineStart: '8px !important', // pin it 8px from the right edge
  },
  '& .MuiFilledInput-root .MuiSelect-icon': {
    insetInlineEnd: 'auto !important',
    insetInlineStart: '8px !important',
  },
  '& .MuiInputLabel-root': {
    right: '26px',
    left: 'auto',
    transformOrigin: 'top right',
    textAlign: 'right',
    position: 'absolute',
  },
  '& .MuiOutlinedInput-root': {
    textAlign: 'right',
    '& input': {
      textAlign: 'right',
    },
    // ← هنا بنستهدف الأيقونة داخل .MuiOutlinedInput-root
    '& .MuiSelect-icon': {
      right: 'auto !important',
      left: '8px !important',
    },
  },
  '& .MuiFilledInput-root': {
    '& .MuiSelect-icon': {
      right: '8px !important',
      left: 'auto !important',
    },
  },
  '& legend': {
    textAlign: 'right',
    direction: 'rtl',
  },
};


/**
 * Reusable TextField component with optional RTL support based on MUI TextField.
 * Props are forwarded to MUI TextField; `sx` is merged with default RTL styles when isRtl is true.
 */
const CustomTextField = React.forwardRef(function CustomTextField(props, ref) {
  const { sx, InputProps, inputProps, isRtl = true, ...other } = props;
  // Determine combined sx: if RTL enabled, merge defaultRtlSx with user sx; otherwise use user sx directly
  let combinedSx;
  if (isRtl) {
    combinedSx = Array.isArray(sx) ? [defaultRtlSx, ...sx] : [defaultRtlSx, sx];
  } else {
    combinedSx = sx;
  }

  // Determine combined inputProps: merge dir if provided, otherwise set dir based on isRtl
  const combinedInputProps = {
    dir: inputProps?.dir || (isRtl ? 'rtl' : 'ltr'),
    ...inputProps,
  };

  return (
    <TextField
      {...other}
      sx={combinedSx}
      inputRef={ref}
      InputProps={InputProps}
      inputProps={combinedInputProps}
    />
  );
});

CustomTextField.propTypes = {
  // All TextField props
  label: PropTypes.node,
  id: PropTypes.string,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  type: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  InputProps: PropTypes.object,
  inputProps: PropTypes.object,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
  /**
   * If true, apply RTL styling overrides; if false, use LTR defaults.
   */
  isRtl: PropTypes.bool,
};

CustomTextField.defaultProps = {
  variant: 'outlined',
  sx: {},
  isRtl: true,
};

export default CustomTextField;
