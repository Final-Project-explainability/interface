// api.js

import axios from "axios";


// Fetch a list of all users
export async function getUsers() {
  try {
    const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage
    if (!token) throw new Error("User is not authenticated");

    const response = await fetch(`${process.env.VUE_APP_API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token in Authorization header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// User login function
export async function login(username, password) {
  try {
    const response = await fetch(`${process.env.VUE_APP_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    // Save the JWT token in localStorage
    localStorage.setItem("token", data.token);

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: error.message || "Login failed" };
  }
}

// Verify if user is authenticated via token
export async function verifyAuth() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { isAuthenticated: false };

    const response = await fetch(`${process.env.VUE_APP_API_URL}/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token in Authorization header
      },
    });

    if (!response.ok) {
      throw new Error("Token is invalid");
    }

    const data = await response.json();
    return { isAuthenticated: true, user: data.user };
  } catch (error) {
    console.error("Error verifying authentication:", error);
    localStorage.removeItem("token"); // Clear token if invalid
    return { isAuthenticated: false };
  }
}

// Logout function: clears user-related data and redirects
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userDetails");

  window.location.href = "/"; // Redirect to homepage
}

// Add a new user to the system
export async function addUser(newUser) {
  try {
    const token = localStorage.getItem("token"); // Token used for authentication
    const response = await fetch(`${process.env.VUE_APP_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    const result = await response.json();
    return { success: true, user: result };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, message: "An error occurred while adding the user." };
  }
}

// Toggle user status (active/suspended)
export async function toggleUserStatus(userId) {
  try {
    const token = localStorage.getItem("token"); // Token used for authentication
    const response = await fetch(`${process.env.VUE_APP_API_URL}/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update user status");
    }

    const result = await response.json();
    return { success: true, user: result };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, message: "An error occurred while updating the user status." };
  }
}

// Delete a user from the system
export async function deleteUser(userId) {
  try {
    const token = localStorage.getItem("token"); // Token used for authentication
    const response = await fetch(`${process.env.VUE_APP_API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    const result = await response.json();
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "An error occurred while deleting the user." };
  }
}

// Get a user's profile by ID (uses axios)
export const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(`${process.env.VUE_APP_API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};


// Update user profile data
export const updateUserProfile = async (userId, updatedData, token) => {
  try {
    const response = await axios.patch(`${process.env.VUE_APP_API_URL}/users/${userId}/updateDetails`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Change password for the currently authenticated user
export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(`${process.env.VUE_APP_API_URL}/users/${userId}/password`, {
      currentPassword,
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error.response?.data || { success: false, message: "Server error" };
  }
};


// Check if username is available (live validation)
export async function checkUsernameAvailability(username) {
  try {
    const response = await fetch(`${process.env.VUE_APP_API_URL}/users/check-username/${username}`);
    if (!response.ok) throw new Error("Failed to check username");

    return await response.json();
  } catch (error) {
    console.error("Error checking username:", error);
    return { available: false, message: "Error checking username" };
  }
}

// Check if license is available (optionally exclude a userId)
export async function checkLicenseAvailability(licenseId, userId = null) {
  try {
    let url = `${process.env.VUE_APP_API_URL}/users/check-license/${licenseId}`;
    if (userId) url += `?userId=${userId}`;

    const response = await fetch(url);
    return await response.json(); // { available: true/false }
  } catch (error) {
    console.error("Error checking license ID:", error);
    return { available: false };
  }
}

// Reset another user's password (admin-level)
export const resetUserPassword = async (userId, newPassword) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${process.env.VUE_APP_API_URL}/users/${userId}/reset-password`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, message: "Failed to reset password." };
  }
};

// Update a user's general details
export async function updateUser(userId, userData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${process.env.VUE_APP_API_URL}/users/${userId}/updateDetails`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return { success: true, user: response.data.user };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user." };
  }
}

// Recover password using username and email
export async function recoverPassword(username, email) {
  try {
    const response = await fetch(`${process.env.VUE_APP_API_URL}/recover-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Recover Password Error:', error);
    return { success: false, message: 'Server error during password recovery.' };
  }
}