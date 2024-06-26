import { ReactElement } from 'react';
import classNames from 'classnames/bind';
import styles from './Checkbox.module.css';

const cx = classNames.bind(styles);

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
}

export function Checkbox({
  label,
  isChecked,
  id,
  isDisabled,
  isError,
  errorMessage,
  onChange,
  ariaLabel,
}: CheckboxProps): ReactElement {
  return (
    <div className={cx('checkbox')}>
      <input
        type="checkbox"
        id={id}
        className={cx('checkbox__input', {
          'checkbox__input--error': isError,
        })}
        disabled={isDisabled}
        onChange={onChange}
        checked={isChecked}
        aria-label={ariaLabel}
        aria-invalid={isError}
        aria-errormessage={`${id}-error`}
      />
      <label
        className={cx('checkbox__label', {
          'checkbox__label--error': isError,
          'checkbox__label--disabled': isDisabled,
        })}
        htmlFor={id}>
        {label}
      </label>
      <p id={`${id}-error`} aria-live="polite" className={cx('input__error-message')}>
        {errorMessage}
      </p>
    </div>
  );
}
