import { useFetchData } from './useFetchData';

interface User {
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

export const useLogin = () => {
  const { data: userDataResponse, isError: isFetchError } = useFetchData<User>(
    'https://api.myjson.online/v1/records/30661ca3-1c7b-49bb-bcc3-44fb3dc34ccb'
  );

  const userData = userDataResponse ? userDataResponse.data : null;

  const login = async (email: string, password: string) => {
    if (userData && userData.email === email && userData.password === password) {
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 3000);
      window.localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      throw new Error(
        isFetchError
          ? 'Login failed. Please try again later.'
          : 'Incorrect email or password. Please try again.'
      );
    }
  };

  return { login };
};
