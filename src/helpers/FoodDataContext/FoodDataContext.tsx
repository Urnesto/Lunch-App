import { ReactNode, createContext, useMemo } from 'react';
import { Meal, Rating, Vendor, Users } from '../../pages/FoodMenu/FoodMenu.types';
import { useFetchData } from '../../hooks/useFetchData';

export interface FoodDataContextType {
  isLoading: boolean;
  isError: boolean;
  vendorsData: Vendor[] | null;
  mealsData: Meal[] | null;
  ratingsData: Rating[] | null;
  usersData: Users[] | null;
}

const initialFoodData: FoodDataContextType = {
  isError: false,
  isLoading: true,
  vendorsData: null,
  mealsData: null,
  ratingsData: null,
  usersData: null,
};

interface FoodDataProviderProps {
  children: ReactNode;
}

export const FoodDataContext = createContext<FoodDataContextType>(initialFoodData);

export function FoodDataProvider({ children }: FoodDataProviderProps) {
  const {
    data: vendorsDataResponse,
    isLoading: vendorsLoading,
    isError: vendorsError,
  } = useFetchData<Vendor[]>(
    'https://api.myjson.online/v1/records/d46d44b5-f23c-4b04-96e4-8f82ad903dfc'
  );

  const vendorsData = vendorsDataResponse ? vendorsDataResponse.data : null;

  const {
    data: mealsDataResponse,
    isLoading: mealsLoading,
    isError: mealsError,
  } = useFetchData<Meal[]>(
    'https://api.myjson.online/v1/records/6cec67ab-2bd9-41cb-91a7-c43242460964'
  );

  const mealsData = mealsDataResponse ? mealsDataResponse.data : null;

  const {
    data: ratingsDataResponse,
    isLoading: ratingsLoading,
    isError: ratingsError,
  } = useFetchData<Rating[]>(
    'https://api.myjson.online/v1/records/fef968f0-41ac-439e-b187-9d14d0b45976'
  );

  const ratingsData = ratingsDataResponse ? ratingsDataResponse.data : null;

  const {
    data: usersDataResponse,
    isLoading: usersLoading,
    isError: usersError,
  } = useFetchData<Users[]>(
    'https://api.myjson.online/v1/records/aae0cd48-1f69-4be2-a8fa-2753341f216a'
  );

  const usersData = usersDataResponse ? usersDataResponse.data : null;

  const isLoading = useMemo(
    () => vendorsLoading || mealsLoading || ratingsLoading || usersLoading,
    [vendorsLoading, mealsLoading, ratingsLoading, usersLoading]
  );

  const isError = useMemo(
    () => vendorsError || mealsError || ratingsError || usersError,
    [vendorsError, mealsError, ratingsError, usersError]
  );

  const foodData: FoodDataContextType = useMemo(
    () => ({
      vendorsData,
      mealsData,
      ratingsData,
      usersData,
      isError,
      isLoading,
    }),
    [vendorsData, mealsData, ratingsData, usersData, isError, isLoading]
  );

  return <FoodDataContext.Provider value={foodData}>{children}</FoodDataContext.Provider>;
}
