import type { FormEvent, ReactElement, ReactNode, Ref } from 'react';
import { useMemo } from 'react';

import styles from './input.module.css';

const Input = ({
  buttons,
  disabled,
  hideValue,
  label,
  monospace,
  onChange,
  placeholder,
  ref,
  updating,
  value,
}: {
  readonly buttons: ReactNode[];
  readonly disabled: boolean;
  readonly hideValue: boolean;
  readonly label: ReactNode;
  readonly monospace: boolean;
  readonly onChange: ((value: string) => void) | null;
  readonly placeholder: string;
  readonly ref?: Ref<HTMLInputElement>;
  readonly updating: boolean;
  readonly value: string;
}): ReactElement => {
  const newOnChange = useMemo(
    () =>
      (event: FormEvent<HTMLInputElement>): void => {
        if (onChange !== null) {
          onChange(event.currentTarget.value);
        }
      },
    [onChange],
  );

  const containerClasses = [
    styles.container,
    ...(disabled ? [styles.disabled] : []),
    ...(updating ? [styles.updating] : []),
  ];

  return (
    <label className={containerClasses.join(' ')}>
      <div className={styles.label}>{label}</div>
      <input
        className={monospace ? `${styles.input} ${styles.monospace}` : styles.input}
        disabled={disabled}
        onChange={newOnChange}
        placeholder={placeholder}
        ref={ref}
        type={hideValue ? 'password' : 'text'}
        value={value}
      />
      <div className={styles.buttonContainer}>{buttons}</div>
    </label>
  );
};

export default Input;
