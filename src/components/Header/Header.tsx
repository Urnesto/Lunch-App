import classNames from 'classnames/bind';
import { ReactElement } from 'react';
import styles from './Header.module.css';

const cx = classNames.bind(styles);

type PageTypes = 'foodMenu' | 'availableLunch' | 'yourOrders' | 'ratings';

interface PageProp {
  pageType: PageTypes;
}

const getTitle = (pageType: PageTypes): string => {
  switch (pageType) {
    case 'foodMenu':
      return 'Lunch Menu';
    case 'availableLunch':
      return 'Available Lunch';
    case 'yourOrders':
      return 'Your Orders';
    case 'ratings':
      return 'Ratings';
    default:
      return pageType;
  }
};

const getSubtitle = (pageType: PageTypes): string => {
  const curr = new Date();

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const weekDay = weekDays[curr.getDay()];

  const firstDayDate = new Date(curr.setDate(curr.getDate() - (curr.getDay() || 7) + 1));
  const lastDayDate = new Date(curr.setDate(curr.getDate() - (curr.getDay() || 7) + 1 + 4));

  const firstDayMonth = firstDayDate.getMonth();
  const firstDay = firstDayDate.getDate().toLocaleString();
  const lastDayMonth = lastDayDate.getMonth();
  const lastDay = lastDayDate.getDate().toLocaleString();

  switch (pageType) {
    case 'foodMenu':
      return `Lunch menu for the week of ${months[firstDayMonth]} ${firstDay} - ${firstDayMonth !== lastDayMonth ? months[lastDayMonth] : ''} ${lastDay}`;
    case 'availableLunch':
      return `${weekDay} dishes that are up for grabs, from your colleagues.`;
    default:
      return `Week of ${firstDay} ${months[firstDayMonth]} - ${lastDay} ${months[lastDayMonth]} `;
  }
};

export function Header({ pageType }: PageProp): ReactElement {
  return (
    <div className={cx('header')}>
      <h1 className={cx('header__title')}>{getTitle(pageType)}</h1>
      <p className={cx('header__subtitle')}>{getSubtitle(pageType)}</p>
    </div>
  );
}