import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useCallback } from 'react';

const useStyles = createUseStyles({
  button: {
    display: 'block',
    width: '24px',
    height: '24px',
    marginRight: '4px',
    border: '0px',
    padding: '0px',
    background: 'transparent',
    cursor: 'pointer',
    pointerEvents: 'auto', // Override [ref:button_container_pointer_events_none].
    opacity: '0.25', // Calculated to match the border and label color.
    '&:focus, &:hover': {
      opacity: '1',
      outline: 'none',
    },
    '&:active': {
      opacity: '0.6',
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

const Button = ({
  description,
  imageName,
  onClick,
}: {
  description: string;
  imageName: string;
  onClick: (() => void) | null;
}): React.ReactElement => {
  const classes = useStyles();

  const onClickWithBlur = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.currentTarget.blur();

      if (onClick !== null) {
        onClick();
      }
    },
    [onClick],
  );

  return (
    <button
      className={classes.button}
      onClick={onClickWithBlur}
      title={description}
      type={onClick === null ? 'submit' : 'button'}
    >
      <img className={classes.icon} src={`/images/${imageName}.svg`} />
    </button>
  );
};

export default Button;
