import { useContext } from 'react';
import { RestaurantContext, type RestaurantContextType } from '../contexts/RestaurantContext';

/**
 * Custom hook to access restaurant context
 * @returns RestaurantContextType - The restaurant context value
 * @throws Error if used outside of RestaurantProvider
 */
export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
