import classNames from 'classnames/bind';
import { ReactElement, useState } from 'react';
import { Tab } from '../../components/Tab';
import { WeekDay } from './FoodMenu.types';
import { MealSearch } from '../../components/MealSearch';
import { FoodList } from './FoodList';
import { useFoodData } from '../../hooks/useFoodData';
import styles from './FoodMenu.module.css';

const cx = classNames.bind(styles);

export function FoodMenu(): ReactElement {
  const { isLoading, isError, vendorsData } = useFoodData();
  const [selectedDay, setSelectedDay] = useState<WeekDay>('Monday');
  const [searchedMealTitle, setSearchedMealTitle] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [sortByValue, setSortByValue] = useState('POPULARITY');
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred while retrieving data</div>;
  return (
    <div className={cx('food-menu__wrapper')}>
      <div className={cx('tab-wrapper')}>
        {dayLabels.map((day) => (
          <Tab
            key={day}
            label={day}
            isActive={selectedDay === day}
            onClick={() => setSelectedDay(day as WeekDay)}
          />
        ))}
      </div>
      <MealSearch
        vendorsData={vendorsData}
        handleSearch={(title, vendor) => {
          setSearchedMealTitle(title);
          setSelectedVendor(vendor);
        }}
        handleSort={(sortBy) => {
          setSortByValue(sortBy);
        }}
      />
      <FoodList
        selectedDay={selectedDay}
        searchedMealTitle={searchedMealTitle}
        selectedVendor={selectedVendor}
        sortByValue={sortByValue}
      />
    </div>
  );
}
