// server.js

require("dotenv").config(); // Load environment variables early

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("./utils/emailService");  // Utility for sending emails


// Dynamically require bcrypt or fallback to bcryptjs
let bcrypt;
try {
  bcrypt = require("bcrypt");
  console.log("✅ Using native bcrypt");
} catch (err) {
  bcrypt = require("bcryptjs");
  console.warn("⚠️ Falling back to bcryptjs");
}

const dotenv = require("dotenv");
dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET || "defaultsecretkey";

// Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/ExplainabilityDataBase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// User Schema Definition
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  title: {
    type: String,
    enum: ["Dr.", "Prof.", "Mr.", "Ms.", "Mrs.", "Miss", "Rev.", "Rabbi", "Fr.", "Eng.", "Adv.", "Hon.", "Sir", "Dame", "None"],
    default: "None"
  },
  licenseId: { type: String, default: null },
  specialty: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  gender: { type: String, enum: ["male", "female"], required: true },
  email: { type: String, default: null },
  profilePictureUrl: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  password: { type: String, required: true },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Skip hashing if the password field wasn't modified
  if (!this.isModified("password")) return next();

  // Generate a cryptographic salt (adds randomness to the hash)
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};


// --- ROUTES ---


// User Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Attempt to find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token upon successful authentication
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Return token and user details to the client (excluding password)
    res.json({
      token,
      user: {
        _id: user._id,
        licenseId: user.licenseId,
        username: user.username,
        fullName: user.fullName,
        title: user.title,
        specialty: user.specialty,
        phoneNumber: user.phoneNumber,
        status: user.status,
        gender: user.gender,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Token verification route
app.get("/auth/verify", authenticateToken, (req, res) => {
  res.json({ message: "User authenticated", user: req.user });
});

// Get all users
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Add new user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Update password (authenticated user)
app.patch("/users/:id/password", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare the current password with the stored (hashed) password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    // Assign the new password directly
    // The Mongoose pre('save') hook will automatically hash it
    user.password = newPassword;

    // Save the updated user
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    res.status(500).json({ success: false, message: "Failed to update password" });
  }
});

// Toggle user status (active/inactive)
app.patch("/users/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from the URL
    const user = await User.findById(id); // Find the user by ID

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Return error if user is not found
    }

    // Toggle the user's status between "active" and "inactive"
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save(); // Save the updated status to the database

    res.json({ message: "User status updated", user }); // Send confirmation response
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Failed to update user status" }); // Handle any errors
  }
});

// Update user profile (protected)
app.patch("/users/:id/updateDetails", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Get the updated data from the request body

    // Prevent updating the password directly here for security reasons
    if (updates.password) {
      return res.status(400).json({ error: "Password update is not allowed here" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// Delete user by ID
app.delete("/users/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from the URL

    const deletedUser = await User.findByIdAndDelete(id); // Attempt to delete the user by ID

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" }); // If the user doesn't exist, return 404
    }

    // Return success message along with the deleted user data
    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" }); // Handle server error
  }
});

// Get user details by ID (without password)
app.get("/user/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from the URL
    const user = await User.findById(id).select("-password"); // Find user by ID and exclude password from the result

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Return 404 if the user doesn't exist
    }

    res.json(user); // Return user data to the frontend
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" }); // Handle unexpected errors
  }
});

// Check if username is available (case-insensitive)
app.get("/users/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Search for username, case-insensitive (ignoring uppercase/lowercase differences)
    const existingUser = await User.findOne({ username: { $regex: `^${username}$`, $options: "i" } });

    if (existingUser) {
      return res.json({ available: false, message: "Username is already taken" });
    }

    res.json({ available: true, message: "Username is available" });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Server error while checking username" });
  }
});

// Check license availability (excluding current user if needed)
app.get("/users/check-license/:licenseId", async (req, res) => {
  try {
    const { licenseId } = req.params;
    const { userId } = req.query;

    if (!licenseId) {
      return res.status(400).json({ error: "License ID is required" });
    }

    const existingUser = await User.findOne({ licenseId });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res.json({ available: false, message: "License ID is already taken" });
    }

    res.json({ available: true, message: "License ID is available" });
  } catch (error) {
    console.error("Error checking license ID:", error);
    res.status(500).json({ error: "Server error while checking license ID" });
  }
});

// Admin resets another user's password
app.patch("/users/:id/reset-password", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Set the new password (encryption will be handled automatically by mongoose pre('save'))
    user.password = newPassword;

    await user.save();  // Save updated user with new password

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
});

// Password recovery via email
app.post("/recover-password", async (req, res) => {
  const { username, email } = req.body;

  console.log("🔹 Recover password request received:", { username, email });

  if (!username || !email) {
    console.warn("⚠️ Missing username or email");
    return res.status(400).json({ success: false, message: "Username or email incorrect." });
  }

  try {
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      console.warn("⚠️ User not found:", username);
    } else if (!user.email || user.email.toLowerCase() !== email.toLowerCase()) {
      console.warn("⚠️ Email mismatch for user:", { userEmail: user.email, inputEmail: email });
    }

    if (!user || !user.email || user.email.toLowerCase() !== email.toLowerCase()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return res.status(400).json({
        success: false,
        reason: !user ? "user-not-found" : !user.email ? "no-email" : "email-mismatch",
        message: "Username or email incorrect.",
      });
    }


    console.log("✅ User verified, proceeding with password reset:", user.username);

    const newPasswordPlain = crypto.randomBytes(6).toString("base64").replace(/[+/=]/g, "").slice(0, 10);
    console.log("🔑 Generated new password:", newPasswordPlain);

    user.password = newPasswordPlain;
    await user.save();
    console.log("✅ Password updated for user:", user.username);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <!-- TODO: replace the logo image after uploading to GitHub -->
        <img src="https://mediclear.cs.bgu.ac.il//static/img/MediClear-logoName.6591a19f.png" alt="MediClear ICU" style="height: 80px; margin-bottom: 20px;" />
        <h2 style="color: #009688;">Your password has been reset</h2>
        <p>Hello ${user.fullName},</p>
        <p>Your password has been reset as requested. Your new password is:</p>
        <div style="background: #f3f3f3; padding: 10px; border-radius: 8px; font-size: 18px; font-weight: bold;">
          ${newPasswordPlain}
        </div>
        <p>Please log in and change it as soon as possible.</p>
        <br/>
        <a href="https://mediclear.cs.bgu.ac.il/" style="display: inline-block; padding: 10px 20px; background: #009688; color: white; text-decoration: none; border-radius: 5px;">Go to MediClear Website for Login</a>
        <br/><br/>
        <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply.</p>
      </div>
    `;


    const mailSent = await sendEmail({
      to: user.email,
      subject: "MediClear ICU - Password Reset",
      text: `Hello ${user.fullName}, your password has been reset. New password: ${newPasswordPlain}`,
      html: htmlContent,
    });

    if (!mailSent) {
      console.error("❌ Failed to send email to:", user.email);
      return res.status(500).json({ success: false, message: "Password recovery failed." });
    }

    console.log("📧 Email successfully sent to:", user.email);
    res.json({ success: true, message: "If the details are correct, you will receive an email shortly." });

  } catch (error) {
    console.error("❌ Recover password error:", error);
    res.status(500).json({ success: false, message: "Password recovery failed." });
  }
});



// Start the server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);






