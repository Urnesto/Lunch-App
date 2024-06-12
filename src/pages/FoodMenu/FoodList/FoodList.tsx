import { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames/bind';
import { FoodCard } from '../../../components/FoodCard';
import { Order, WeekDay, Meal } from '../FoodMenu.types';
import { Workdays } from '../../../helpers/OrderSummaryContext';
import { useOrderSummary } from '../../../hooks/useOrderSummary';
import { Toast } from '../../../components/Toast';
import { useFoodData } from '../../../hooks/useFoodData';
import { getVendorName } from '../../../helpers/helperFunctions/getVendorName';
import { getUser } from '../../../helpers/helperFunctions/getUser';
import styles from './FoodList.module.css';

interface FoodListProps {
  selectedDay: WeekDay;
  searchedMealTitle: string;
  selectedVendor: string;
  sortByValue: string;
}

const cx = classNames.bind(styles);
export function FoodList({
  selectedDay,
  searchedMealTitle,
  selectedVendor,
  sortByValue,
}: FoodListProps) {
  const { mealsData, ratingsData, vendorsData, usersData } = useFoodData();
  const { orders, modifyOrders } = useOrderSummary();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const getRating = useCallback(
    (id: number, isForSort: boolean) => {
      const filteredRatings = ratingsData?.filter((rating) => rating.mealId === id) ?? [];
      if (filteredRatings.length > 0) {
        const ratings = filteredRatings.map((rating) => rating.rating.rating);
        const sum = ratings.reduce((total, rating) => total + rating, 0);
        const averageRating = sum / ratings.length;
        return averageRating.toFixed(1);
      }
      if (isForSort) {
        return 0;
      }
      return 'Not rated';
    },
    [ratingsData]
  );
  const userData = localStorage.getItem('userData');

  const isMealOrdered = useMemo(() => {
    if (userData) {
      const { orders: storedOrders } = JSON.parse(userData);
      return storedOrders.filter((order: Order) => order.weekDay === selectedDay)?.length > 0;
    }
    return false;
  }, [selectedDay, userData]);

  const filteredMeals = useMemo(() => {
    if (!mealsData) return [];
    let filteredMealData = mealsData.filter((meal) => meal.weekDays.includes(selectedDay));
    if (searchedMealTitle) {
      filteredMealData = filteredMealData.filter((meal) =>
        meal.title.toLowerCase().includes(searchedMealTitle.toLowerCase())
      );
    }
    if (selectedVendor) {
      filteredMealData = filteredMealData.filter(
        (meal) =>
          getVendorName(vendorsData, meal.vendorId).toLowerCase() === selectedVendor.toLowerCase()
      );
    }
    if (sortByValue) {
      if (sortByValue === 'POPULARITY') {
        filteredMealData = filteredMealData.sort(
          (a: Meal, b: Meal) => b.ordersCount - a.ordersCount
        );
      }
      if (sortByValue === 'PRICE') {
        filteredMealData = filteredMealData.sort((a: Meal, b: Meal) => a.price - b.price);
      }
      if (sortByValue === 'RATING') {
        filteredMealData = filteredMealData.sort(
          (a: Meal, b: Meal) =>
            Number(getRating(Number(b.id), true)) - Number(getRating(Number(a.id), true))
        );
      }
    }
    return filteredMealData;
  }, [
    mealsData,
    selectedDay,
    searchedMealTitle,
    selectedVendor,
    vendorsData,
    sortByValue,
    getRating,
  ]);

  const noMealsFound = useMemo(() => !filteredMeals.length, [filteredMeals]);
  const dayToLowerCase = selectedDay.toLowerCase() as Workdays;

  const isMealTypeAddedForDay = (mealType: string) => {
    const ordersForSelectedDay = orders.find((order) => order.day === dayToLowerCase);
    if (!ordersForSelectedDay) {
      return false;
    }
    return ordersForSelectedDay.orders.some((orderItem) => orderItem.mealType === mealType);
  };

  const handleAddToOrderSummary = (meal: Meal): void => {
    modifyOrders({
      action: 'ADD_ORDER',
      day: dayToLowerCase,
      meal: {
        dishType: meal.dishType,
        mealId: meal.id,
        mealType: meal.mealType,
        price: meal.price,
        title: meal.title,
        vendor: getVendorName(vendorsData, meal.vendorId),
      },
    });
    setShowToast(true);
    setToastMessage(`${meal.title} has been added to your cart. Excellent Choice!`);
  };

  const getComments = (id: number) => {
    const filteredComments = ratingsData?.filter((rating) => rating.mealId === id);
    return filteredComments?.map((comment) => {
      const userDetails = getUser(usersData, comment.rating.userId);
      return {
        comment: comment.rating.comment,
        name: userDetails?.name,
        surname: userDetails?.surname,
        userIcon: userDetails?.img,
      };
    });
  };

  return (
    <div className={cx('menu-wrapper')}>
      {isMealOrdered || noMealsFound ? (
        <h2 className={cx('menu-wrapper__empty-meals-text')}>
          {isMealOrdered ? `You have already ordered meals for ${selectedDay}` : 'No results found'}
        </h2>
      ) : (
        filteredMeals.map((meal) => (
          <FoodCard
            key={meal.id}
            vendor={getVendorName(vendorsData, meal.vendorId)}
            title={meal.title}
            description={meal.description}
            price={meal.price}
            isVegetarian={meal.vegetarian}
            isSpicy={meal.spicy}
            rating={getRating(Number(meal.id), false)}
            dishType={meal.dishType}
            onClick={() => handleAddToOrderSummary(meal)}
            isDisabled={isMealTypeAddedForDay(meal.mealType)}
            comments={getComments(Number(meal.id))}
          />
        ))
      )}

      <Toast
        key={toastMessage}
        isVisible={showToast}
        toastType="info"
        content={toastMessage}
        onClick={() => setShowToast(false)}
      />
    </div>
  );
}
