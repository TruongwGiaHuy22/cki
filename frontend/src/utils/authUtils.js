/**
 * Auth Utils - Helper functions for authentication management
 */

/**
 * Get user token (regular user only)
 * Returns null if it's an admin token
 */
export const getUserToken = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return null;

  // Validate that this is NOT an admin token
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        console.warn('Admin token detected on user context, clearing');
        clearUserAuth();
        return null;
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }

  return token;
};

/**
 * Get admin token
 */
export const getAdminToken = () => {
  return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
};

/**
 * Get user data (regular user only)
 */
export const getUserData = () => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    // Don't return admin users on user context
    if (user.role === 'admin') {
      return null;
    }
    return user;
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
};

/**
 * Get admin user data
 */
export const getAdminData = () => {
  const userStr = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing admin data:', e);
    return null;
  }
};

/**
 * Clear regular user authentication
 */
export const clearUserAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

/**
 * Clear admin authentication
 */
export const clearAdminAuth = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  sessionStorage.removeItem('admin_token');
  sessionStorage.removeItem('admin_user');
};

/**
 * Clear all authentication
 */
export const clearAllAuth = () => {
  clearUserAuth();
  clearAdminAuth();
};

/**
 * Get auth headers for API calls (user)
 */
export const getUserAuthHeaders = () => {
  const token = getUserToken();
  if (!token) return null;

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Get auth headers for API calls (admin)
 */
export const getAdminAuthHeaders = () => {
  const token = getAdminToken();
  if (!token) return null;

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = () => {
  return getUserToken() !== null && getUserData() !== null;
};

/**
 * Check if admin is logged in
 */
export const isAdminLoggedIn = () => {
  return getAdminToken() !== null && getAdminData() !== null;
};
