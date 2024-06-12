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

export const useRegister = () => {
  const { data: userData, isError } = useFetchData<User>(
    'https://api.myjson.online/v1/records/30661ca3-1c7b-49bb-bcc3-44fb3dc34ccb'
  );

  const updateUser = async (email: string, password: string): Promise<void> => {
    if (isError) {
      throw new Error();
    }
    const response = await fetch(
      'https://api.myjson.online/v1/records/30661ca3-1c7b-49bb-bcc3-44fb3dc34ccb',
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ ...userData, email, password }),
      }
    );
    await response.json();
  };
  return { updateUser };
};
