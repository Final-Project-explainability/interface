// api.js

// שליפת רשימת כל המשתמשים
export async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    const users = await getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid username or password" };
    }

    if (user.status !== "active") {
      return {
        success: false,
        message: "User account is inactive. Please contact the admin.",
      };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "An error occurred during login." };
  }
}

// הוספת משתמש חדש
export async function addUser(newUser) {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const response = await fetch(`http://localhost:3000/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
