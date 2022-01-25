import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useMemo } from 'react';

const width = '320px';
const height = '64px';
const labelHeight = '20px';
const inputHeight = '28px';

const useStyles = createUseStyles({
  container: {
    display: 'flow-root', // Create a block formatting context to contain margins of descendants.
    position: 'relative', // Used for positioning `buttonContainer` (below).
    width,
    height,
    margin: '16px',
    border: '2px solid #cccccc',
    borderRadius: '8px',
    cursor: 'text',
    '&:focus-within': {
      border: (disabled: boolean) =>
        disabled ? undefined : '2px solid #56b8ff',
    },
  },
  label: {
    width: '200px',
    height: labelHeight,
    margin: '6px 16px 0px 16px',
    lineHeight: labelHeight,
    fontSize: '12px',
    fontWeight: '600',
    color: '#999999',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: (disabled: boolean) => (disabled ? 'default' : undefined),
    userSelect: 'none',
  },
  input: {
    display: 'block',
    width: '288px',
    height: inputHeight,
    margin: '0px 16px 6px 16px',
    border: '0px',
    padding: '0px',
    outline: '0px',
    background: 'transparent',
    lineHeight: inputHeight,
    fontSize: '16px',
    color: '#222222',
  },
  buttonContainer: {
    display: 'flex',
    position: 'absolute', // Overlay on top of `container` (above).
    top: '20px',
    left: '0px',
    width,
    height: '24px',
    justifyContent: 'flex-end',
    paddingRight: '10px',

    // Don't steal clicks from `container` (above) [tag:button_container_pointer_events_none].
    pointerEvents: 'none',
  },
});

const Input = React.forwardRef(
  (
    {
      buttons,
      disabled,
      hideValue,
      label,
      onChange,
      placeholder,
      value,
    }: {
      buttons: React.ReactChild[];
      disabled: boolean;
      hideValue: boolean;
      label: React.ReactChild;
      onChange: ((value: string) => void) | null;
      placeholder: string;
      value: string;
    },
    ref: React.ForwardedRef<HTMLInputElement>,
  ): React.ReactElement => {
    const classes = useStyles(disabled);
    const newOnChange = useMemo(
      () =>
        (event: React.FormEvent<HTMLInputElement>): void => {
          if (onChange !== null) {
            onChange(event.currentTarget.value);
          }
        },
      [onChange],
    );

    return (
      <label className={classes.container}>
        <div className={classes.label}>{label}</div>
        <input
          className={classes.input}
          disabled={disabled}
          onChange={newOnChange}
          placeholder={placeholder}
          ref={ref}
          type={hideValue ? 'password' : 'text'}
          value={value}
        />
        <div className={classes.buttonContainer}>{buttons}</div>
      </label>
    );
  },
);

Input.displayName = 'Input';

export default Input;
