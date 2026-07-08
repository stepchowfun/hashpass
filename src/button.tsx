import type { MouseEvent, ReactElement } from 'react';
import { useCallback } from 'react';

import styles from './button.module.css';

export type ButtonType =
  | { type: 'noninteractive' }
  | { type: 'normal'; onClick: () => void }
  | { type: 'submit' };

export const Button = ({
  buttonType,
  description,
  imageName,
}: {
  readonly buttonType: ButtonType;
  readonly description: string;
  readonly imageName: string;
}): ReactElement => {
  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.currentTarget.blur();

      if (buttonType.type === 'normal') {
        event.preventDefault();
        event.stopPropagation();
        buttonType.onClick();
      }
    },
    [buttonType],
  );

  return (
    <button
      className={
        buttonType.type === 'noninteractive'
          ? `${styles.button} ${styles.noninteractive}`
          : styles.button
      }
      onClick={onClick}
      title={description}
      type={buttonType.type === 'submit' ? 'submit' : 'button'}
    >
      <img alt={description} className={styles.icon} src={`images/${imageName}.svg`} />
    </button>
  );
};
