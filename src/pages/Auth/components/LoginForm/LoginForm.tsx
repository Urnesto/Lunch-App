import React, { useReducer, useState } from 'react';
import classNames from 'classnames/bind';
import { Input } from '../../../../components/Input';
import { Button } from '../../../../components/Button';
import { EMAIL_REGEX } from '../../../../constants';
import { useLogin } from '../../../../hooks/useLogin';
import { AuthToastState } from '../Auth.types';
import { Loader } from '../../../../components/Loader';
import styles from './LoginForm.module.css';

const cx = classNames.bind(styles);

interface LoginFormProps {
  handleToast: (toastState: AuthToastState) => void;
}

interface State {
  email: string;
  password: string;
  emailErrorMsg: string;
  passwordErrorMsg: string;
}

type Action =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_EMAIL_ERROR_MSG'; payload: string }
  | { type: 'SET_PASSWORD_ERROR_MSG'; payload: string };

const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_EMAIL_ERROR_MSG':
      return { ...state, emailErrorMsg: action.payload };
    case 'SET_PASSWORD_ERROR_MSG':
      return { ...state, passwordErrorMsg: action.payload };
    default:
      return state;
  }
};

const initialState = {
  email: '',
  password: '',
  emailErrorMsg: '',
  passwordErrorMsg: '',
};

export function LoginForm({ handleToast }: LoginFormProps) {
  const { login } = useLogin();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { email, password, emailErrorMsg, passwordErrorMsg } = state;
  const [isHidden, setIsHidden] = useState(true);

  const setEmail = (value: string) => dispatch({ type: 'SET_EMAIL', payload: value });
  const setPassword = (value: string) => dispatch({ type: 'SET_PASSWORD', payload: value });
  const setEmailErrorMsg = (value: string) =>
    dispatch({ type: 'SET_EMAIL_ERROR_MSG', payload: value });
  const setPasswordErrorMsg = (value: string) =>
    dispatch({ type: 'SET_PASSWORD_ERROR_MSG', payload: value });
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailErrorMsg('');
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordErrorMsg('');
  };

  const handleLogin = async () => {
    if (!email) {
      setEmailErrorMsg('Please enter your email.');
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailErrorMsg('Invalid email address');
    } else {
      setEmailErrorMsg('');
    }
    if (!password) {
      setPasswordErrorMsg('Please enter your password.');
    } else {
      setPasswordErrorMsg('');
    }
    if (email && EMAIL_REGEX.test(email) && password) {
      setIsHidden(false);
      try {
        await login(email, password);
      } catch (e) {
        if (e instanceof Error) {
          setIsHidden(true);
          handleToast({ message: e.message, type: 'warning' });
        }
      }
    }
  };
  const handleToastMessage = () => {
    handleToast({ message: 'email: test@test.com , password : 123', type: 'success' });
  };

  return (
    <form className={cx('login-form')} aria-label="Login Form">
      <div className={cx('login-form__container')}>
        <div className={cx('login-form__head')}>
          <h1>Login</h1>
          <p>Lunch won’t order itself</p>
        </div>
        <div className={cx('login-form__input')}>
          <Input
            id="email"
            textFieldType="email"
            placeholder="Email"
            label="Email"
            value={email}
            name="email"
            onChange={handleEmailChange}
            aria-required="true"
            aria-label="Email Input Field"
            isError={!!emailErrorMsg}
            errorMessage={emailErrorMsg}
          />
          <div className={cx('login-form__password-container')}>
            <Input
              id="password"
              textFieldType="password"
              placeholder="Password"
              label="Password"
              value={password}
              name="password"
              onChange={handlePasswordChange}
              aria-required="true"
              aria-label="Password Input Field"
              isError={!!passwordErrorMsg}
              errorMessage={passwordErrorMsg}
            />
            <button aria-label="Forgot Password" className={cx('login-form__button')} type="button">
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
      <div className={cx('login-form__button-container')}>
        <Button
          title="Log in"
          buttonSize="md"
          buttonType="primary"
          buttonWidth="full"
          iconType="arrow"
          onClick={handleLogin}
        />
        <Button
          title="Check login credentials"
          buttonSize="md"
          buttonType="primary"
          buttonWidth="full"
          iconType="arrow"
          onClick={handleToastMessage}
        />
      </div>
      <Loader isHidden={isHidden} />
    </form>
  );
}
