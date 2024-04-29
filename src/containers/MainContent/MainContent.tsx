import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { UserCard } from '../../components/UserCard';

export function MainContent() {
  const [isOrderSummaryVisible, setIsOrderSummaryVisible] = useState(true);
  const handleOrderSummaryVisible = () => {
    setIsOrderSummaryVisible(true);
  };
  // TEST data for local storage it will be delted before merge
  useEffect(() => {
    fetch('http://localhost:3002/user')
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('userData', JSON.stringify(data));
      })
      .catch((error) => {
        throw new Error(`An error occurred while fetching user data: ${error}`);
      });
  }, []);

  return (
    <>
      <Sidebar />
      <Outlet />
      <header>
        <UserCard toggleOrderSummary={handleOrderSummaryVisible} />
      </header>
      {isOrderSummaryVisible && <div>Order Summary</div>}
    </>
  );
}
