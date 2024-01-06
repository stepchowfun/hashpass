import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useCallback } from 'react';

export type ButtonType =
  | { type: 'noninteractive' }
  | { type: 'normal'; onClick: () => void }
  | { type: 'submit' };

interface ButtonStyleArgs {
  interactive: boolean;
}

const useStyles = createUseStyles({
  button: {
    display: 'block',
    width: '24px',
    height: '24px',
    marginRight: '4px',
    border: '0px',
    padding: '0px',
    background: 'transparent',
    cursor: ({ interactive }: ButtonStyleArgs) =>
      interactive ? 'pointer' : 'default',
    pointerEvents: 'auto', // Override [ref:button_container_pointer_events_none].

    // The 0.25 value was calculated to match the border and label color.
    opacity: ({ interactive }: ButtonStyleArgs) => (interactive ? '0.25' : '1'),

    '&:focus, &:hover': {
      opacity: '1',
      outline: 'none',
    },
    '&:active': {
      opacity: ({ interactive }: ButtonStyleArgs) =>
        interactive ? '0.6' : '1',
    },
  },
  icon: {
    display: 'block',
    width: '24px',
    height: '24px',
    border: '0px',
    padding: '0px',
  },
});

export const Button = ({
  buttonType,
  description,
  imageName,
}: {
  readonly buttonType: ButtonType;
  readonly description: string;
  readonly imageName: string;
}): React.ReactElement => {
  const classes = useStyles({
    interactive: buttonType.type !== 'noninteractive',
  });

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
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
      className={classes.button}
      onClick={onClick}
      title={description}
      type={buttonType.type === 'submit' ? 'submit' : 'button'}
    >
      <img className={classes.icon} src={`images/${imageName}.svg`} />
    </button>
  );
};
