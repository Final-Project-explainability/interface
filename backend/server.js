const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "defaultsecretkey";

// הגדרות בסיסיות
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// חיבור ל-MongoDB
mongoose
  .connect("mongodb://localhost:27017/ExplainabilityDataBase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// סכימת משתמש
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  title: { type: String, enum: ["Dr.", "Prof.", "Mr.", "Ms.", "None"], default: "None" },
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

// Middleware להצפנת הסיסמה לפני שמירתה
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // אם הסיסמה לא שונתה, דלג
  const salt = await bcrypt.genSalt(10); // יצירת מלח (salt)
  this.password = await bcrypt.hash(this.password, salt); // הצפנת הסיסמה
  next();
});

const User = mongoose.model("User", UserSchema);

// Middleware לאימות טוקן
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// מסלול התחברות
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // בדיקת התאמה בין הסיסמה שהוזנה לסיסמה המוצפנת
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // יצירת JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // מחזיר את כל הנתונים הרלוונטיים ל-Frontend
    res.json({
      token,
      user: {
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

// אימות טוקן
app.get("/auth/verify", authenticateToken, (req, res) => {
  res.json({ message: "User authenticated", user: req.user });
});

// ROUTE 1: קבלת כל המשתמשים (מוגן)
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ROUTE 2: הוספת משתמש חדש
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// ROUTE 3: עדכון סיסמה
app.patch("/users/:id/password", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});


app.patch("/users/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // קבלת ה-ID מה-URL
    const user = await User.findById(id); // מציאת המשתמש לפי ID

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // אם המשתמש לא נמצא
    }

    // שינוי סטטוס המשתמש
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save(); // שמירת השינויים

    res.json({ message: "User status updated", user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
});



// ROUTE: מחיקת משתמש
app.delete("/users/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // קבלת ה-ID מה-URL

    const deletedUser = await User.findByIdAndDelete(id); // מחיקת המשתמש לפי ID

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" }); // אם המשתמש לא נמצא
    }

    res.json({ message: "User deleted successfully", deletedUser }); // החזרת הודעת הצלחה ונתוני המשתמש שנמחק
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" }); // טיפול בשגיאה
  }
});



// הפעלת השרת
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
