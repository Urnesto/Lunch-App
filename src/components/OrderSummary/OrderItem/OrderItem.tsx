import classNames from 'classnames/bind';
import { getDishTypeImage } from '../../FoodCard';
import { DeleteBinIcon } from '../../../utils/iconManager';
import { Order, Workdays, useOrderSummary } from '../../../helpers/OrderSummaryContext';
import styles from './OrderItem.module.css';

const cx = classNames.bind(styles);

type OrderItemProps = {
  day: Workdays;
  order: Order;
};

export function OrderItem({ day, order }: OrderItemProps) {
  const items = useOrderSummary();
  const handleItemRemoval = () => {
    items.modifyArray({ day, mealId: order.mealId, action: 'REMOVE' });
  };
  return (
    <article className={cx('order-item')}>
      <div>
        <img
          className={cx('order-item__icon')}
          src={getDishTypeImage(order.dishType)}
          alt={order.title}
        />
      </div>
      <div className={cx('order-item__info')}>
        <span className={cx('order-item__info__title')}>{order.vendor}</span>
        <div className={cx('order-item__info__body')}>
          <span>{order.title}</span>
          <div className={cx('order-item__info__body__actions')}>
            <span className={cx('order-item__info__body__actions__price')}>
              {order.price.toFixed(2)}
            </span>
            <button
              className={cx('order-item__info__body__actions__remove')}
              aria-label="remove-order-summary-item"
              type="button"
              onClick={handleItemRemoval}>
              <DeleteBinIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
