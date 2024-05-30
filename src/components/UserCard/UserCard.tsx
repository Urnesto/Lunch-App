import { ReactElement, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Card } from '../Card';
import { BadgeCount } from '../Badge';
import { ShoppingBasketIcon, Logout, ArrowFilledIcon, UserProfile } from '../../utils/iconManager';
import { useAuth } from '../../helpers/AuthContext';
import { useOrderSummary } from '../../hooks/useOrderSummary';
import styles from './UserCard.module.css';

const cx = classNames.bind(styles);

interface UserData {
  email: string;
  password: string;
  name: string;
  surname: string;
  balance: number;
  img: string;
  orders: {
    weekDay: string;
    mealIds: number[];
  }[];
}

interface UserCardProps {
  toggleOrderSummary: () => void;
  isOrderSummaryVisible: boolean;
}

export function UserCard({
  toggleOrderSummary,
  isOrderSummaryVisible,
}: UserCardProps): ReactElement {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);
  const { logout } = useAuth();
  const { orders } = useOrderSummary();
  const storedUserData = localStorage.getItem('userData');

  useEffect(() => {
    if (storedUserData) {
      const parsedUserData: UserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, [storedUserData]);

  if (!userData) {
    return <div>Loading...</div>;
  }
  const { name, surname, balance, img } = userData!;
  const numberOfOrders = orders.length;

  return (
    <section aria-label="User card">
      <Card spacing="2xs" shadow="s" roundedCorners="left" isNoBorder>
        <div className={cx('user-card__layout')}>
          <div className={cx('user-card__header')}>
            <div className={cx('user-card__avatar-container')}>
              {!imgLoadError ? (
                <img
                  src={img}
                  alt="profile avatar"
                  className={cx('user-card__avatar')}
                  onError={() => setImgLoadError(true)}
                />
              ) : (
                <UserProfile className={cx('user-card__avatar')} />
              )}
              <div className={cx('user-card__button-arrow')}>
                <button
                  type="button"
                  onClick={() => setShowLogoutButton(!showLogoutButton)}
                  aria-label="Toggle Logout"
                  aria-haspopup="true"
                  aria-expanded={showLogoutButton}
                  aria-controls="user-card__actions-menu">
                  <ArrowFilledIcon
                    className={cx('user-card__button-icon', {
                      'user-card__button-icon-rotated': showLogoutButton,
                    })}
                  />
                </button>
                {showLogoutButton && (
                  <ul
                    id="user-card__actions-menu"
                    role="menu"
                    tabIndex={-1}
                    aria-activedescendant="logout-button">
                    <li>
                      <button
                        type="button"
                        id="logout-button"
                        className={cx('user-card__logout-button')}
                        onClick={logout}>
                        <span className={cx('user-card__logout-text')}>
                          <Logout className={cx('user-card__logout-icon')} />
                          Log Out
                        </span>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <p>
              {name} {surname}
            </p>
          </div>
          <div className={cx('user-card__content')}>
            <div className={cx('user-card__content-balance')}>
              <span>Balance</span>
              <span>&euro;{balance}</span>
            </div>
            <div className={cx('user_card__orders-button-wrapper')}>
              <button
                type="button"
                className={cx('user-card__number-of-orders')}
                aria-label="Open Order Summary"
                aria-controls="order-summary__region"
                aria-expanded={isOrderSummaryVisible}
                onClick={toggleOrderSummary}>
                <ShoppingBasketIcon className={cx('user-card__shopping-basket-icon')} />
                {numberOfOrders > 0 && (
                  <span className={cx('user-card__badge')}>
                    <BadgeCount count={numberOfOrders} />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
