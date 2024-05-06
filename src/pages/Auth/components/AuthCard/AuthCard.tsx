import classNames from 'classnames/bind';
import { ReactElement, useState } from 'react';
import { LogoHorizontal } from '../../../../utils/iconManager';
import { Card } from '../../../../components/Card';
import { LoginForm } from '../LoginForm/LoginForm';
import { RegisterForm } from '../RegisterForm/RegisterForm';
import { Tab } from '../../../../components/Tab';
import { Toast } from '../../../../components/Toast';
import styles from './AuthCard.module.css';

const cx = classNames.bind(styles);

export function AuthCard(): ReactElement {
  const [activeTab, setActiveTab] = useState('LOGIN');
  const [isToastShown, setIsToastShown] = useState(false);
  const handleRegistration = () => {
    setIsToastShown(true);
    setActiveTab('LOGIN');
  };

  return (
    <Card spacing="s" shadow="m">
      {isToastShown && (
        <Toast
          content="Congratulations, your account has been succesfully created!"
          toastType="success"
          onClick={() => setIsToastShown(!isToastShown)}
        />
      )}
      <div className={cx('auth-card')}>
        <LogoHorizontal className={cx('auth-card__logo')} />
        <div className={cx('auth-card__header')}>
          <Tab
            label="LOGIN"
            isActive={activeTab === 'LOGIN'}
            onClick={() => setActiveTab('LOGIN')}
          />
          <Tab
            label="REGISTER"
            isActive={activeTab === 'REGISTER'}
            onClick={() => setActiveTab('REGISTER')}
          />
        </div>
        {activeTab === 'LOGIN' ? (
          <LoginForm />
        ) : (
          <RegisterForm handleRegistration={handleRegistration} />
        )}
      </div>
    </Card>
  );
}
