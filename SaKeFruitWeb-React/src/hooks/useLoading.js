import { useState, useCallback } from 'react';

/**
 * Custom hook để quản lý trạng thái loading
 * @returns {Object} { isLoading, startLoading, stopLoading, withLoading }
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  /**
   * Wrapper function để tự động hiện/ẩn loading khi thực hiện async function
   * @param {Function} asyncFunction - Async function cần thực hiện
   * @param {number} minDelay - Thời gian tối thiểu hiển thị loading (ms)
   */
  const withLoading = useCallback(
    async (asyncFunction, minDelay = 500) => {
      startLoading();
      const startTime = Date.now();
      
      try {
        const result = await asyncFunction();
        
        // Đảm bảo loading hiển thị ít nhất minDelay ms
        const elapsed = Date.now() - startTime;
        if (elapsed < minDelay) {
          await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
        }
        
        return result;
      } catch (error) {
        throw error;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};
