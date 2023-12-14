import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useMemo } from 'react';

const labelHeight = '20px';
const inputHeight = '28px';

interface InputStyleArgs {
  disabled: boolean;
  monospace: boolean;
  updating: boolean;
}

const useStyles = createUseStyles({
  container: {
    display: 'flow-root', // Create a block formatting context to contain margins of descendants.
    position: 'relative', // Used for positioning `buttonContainer` (below).
    width: '320px',
    height: '64px',
    margin: '16px',
    border: '2px solid #cccccc',
    borderRadius: '8px',
    cursor: 'text',
    '&:focus-within': {
      border: ({ disabled }: InputStyleArgs) =>
        disabled ? '2px solid #cccccc' : '2px solid #56b8ff',
    },
    background: ({ updating }: InputStyleArgs) =>
      updating ? '#fafafa' : 'transparent',
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
    cursor: ({ disabled }: InputStyleArgs) => (disabled ? 'default' : 'text'),
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
    fontFamily: ({ monospace }: InputStyleArgs) =>
      monospace
        ? [
            'ui-monospace',
            'SFMono-Regular',
            'SF Mono',
            'Menlo',
            'Consolas',
            '"Liberation Mono"',
            'monospace',
          ]
        : 'inherit',
    color: '#222222',
  },
  buttonContainer: {
    display: 'flex',
    position: 'absolute', // Overlay on top of `container` (above).
    top: '20px',
    left: '0px',
    width: '316px',
    height: '24px',
    justifyContent: 'flex-end',
    paddingRight: '6px',

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
      monospace,
      onChange,
      placeholder,
      updating,
      value,
    }: {
      readonly buttons: React.ReactChild[];
      readonly disabled: boolean;
      readonly hideValue: boolean;
      readonly label: React.ReactChild;
      readonly monospace: boolean;
      readonly onChange: ((value: string) => void) | null;
      readonly placeholder: string;
      readonly updating: boolean;
      readonly value: string;
    },
    ref: React.ForwardedRef<HTMLInputElement>,
  ): React.ReactElement => {
    const classes = useStyles({ disabled, monospace, updating });
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
