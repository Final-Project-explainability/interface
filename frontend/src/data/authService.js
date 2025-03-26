// api.js

import axios from "axios";


// שליפת רשימת כל המשתמשים
export async function getUsers() {
  try {
    const token = localStorage.getItem("token"); // שליפת ה-JWT מ-localStorage
    if (!token) throw new Error("User is not authenticated");

    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // שליחת הטוקן ב-Header
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

// כניסת משתמש (Login)
export async function login(username, password) {
  try {
    const response = await fetch("http://localhost:3000/login", {
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

    // שמירת ה-JWT ב-localStorage
    localStorage.setItem("token", data.token);

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: error.message || "Login failed" };
  }
}

// אימות משתמש מחובר
export async function verifyAuth() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { isAuthenticated: false };

    const response = await fetch("http://localhost:3000/auth/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // שליחת הטוקן ל-Backend
      },
    });

    if (!response.ok) {
      throw new Error("Token is invalid");
    }

    const data = await response.json();
    return { isAuthenticated: true, user: data.user };
  } catch (error) {
    console.error("Error verifying authentication:", error);
    localStorage.removeItem("token"); // מחיקת token אם אינו תקף
    return { isAuthenticated: false };
  }
}

// יציאת משתמש (Logout)
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userDetails");

  window.location.href = "/"; // יציאה מוחלטת ומעבר לדף הבית
}


// הוספת משתמש חדש
export async function addUser(newUser) {
  try {
    const token = localStorage.getItem("token"); // טוקן לאימות
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // שליחת הטוקן
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

// עדכון סטטוס משתמש (פעיל/מושעה)
export async function toggleUserStatus(userId) {
  try {
    const token = localStorage.getItem("token"); // טוקן לאימות
    const response = await fetch(`http://localhost:3000/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // שליחת הטוקן
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

// מחיקת משתמש
export async function deleteUser(userId) {
  try {
    const token = localStorage.getItem("token"); // טוקן לאימות
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // שליחת הטוקן
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




// שליפת פרטי משתמש לפי ID
export const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:3000/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};


// Update user profile
export const updateUserProfile = async (userId, updatedData, token) => {
  try {
    const response = await axios.patch(`http://localhost:3000/users/${userId}/updateDetails`, updatedData, {
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


export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(`http://localhost:3000/users/${userId}/password`, {
      currentPassword,
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data; // אמור להחזיר { success: true, message: "..." }
  } catch (error) {
    console.error("Error changing password:", error);
    throw error.response?.data || { success: false, message: "Server error" };
  }
};


// פונקציה לבדיקת שם משתמש בלייב
export async function checkUsernameAvailability(username) {
  try {
    const response = await fetch(`http://localhost:3000/users/check-username/${username}`);
    if (!response.ok) throw new Error("Failed to check username");

    return await response.json();
  } catch (error) {
    console.error("Error checking username:", error);
    return { available: false, message: "Error checking username" };
  }
}

export async function checkLicenseAvailability(licenseId, userId = null) {
  try {
    let url = `http://localhost:3000/users/check-license/${licenseId}`;
    if (userId) url += `?userId=${userId}`;

    const response = await fetch(url);
    return await response.json(); // { available: true/false }
  } catch (error) {
    console.error("Error checking license ID:", error);
    return { available: false };
  }
}




export const resetUserPassword = async (userId, newPassword) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `http://localhost:3000/users/${userId}/reset-password`,
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



export async function updateUser(userId, userData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `http://localhost:3000/users/${userId}/updateDetails`,
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


