import { useState } from 'react';
import classNames from 'classnames/bind';
import { RefreshButton } from './components/RefreshButton';
import { Card } from '../../../../components/Card';
import { Pagination } from './components/Pagination';
import { AvailableOrdersItem } from './components/AvailableOrdersItem';
import styles from './AvailableOrdersCard.module.css';

const cx = classNames.bind(styles);

export function AvailableOrdersCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  // eslint-disable-next-line
  const items = Array.from({ length: 1 }, (_, index) => ({}));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const getCurrentPageItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentItems = getCurrentPageItems();

  return currentItems.length > 0 ? (
    <div className={cx('available-lunch')}>
      <Card shadow="s">
        <div className={cx('available-lunch__container')}>
          <div className={cx('available-lunch__header')}>
            <h2 className={cx('available-lunch__header-heading')}>Available Orders</h2>
            <RefreshButton />
          </div>
          <table className={cx('available-lunch__table')}>
            <thead>
              <tr className={cx('available-lunch__table-header')}>
                <th>Order Summary</th>
                <th>Vendor</th>
                <th>Take It From</th>
              </tr>
            </thead>
            <tbody className={cx('available-lunch__table-body')}>
              <AvailableOrdersItem
                img="https://i1.sndcdn.com/artworks-ov36HLyQWdSRZyVI-0R0DpA-t500x500.jpg"
                name="Gregory"
                surname="Lawls"
                onClick={() => {
                  alert('Food is reserved');
                }}
                orders={[{ dishType: 'burger', title: 'Burgir', vendor: 'Jeuss' }]}
              />
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </Card>
    </div>
  ) : (
    <div className={cx('available-lunch__empty-lunch-text')}>No available lunches</div>
  );
}
