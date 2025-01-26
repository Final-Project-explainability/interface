const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// התחברות ל-MongoDB
mongoose
  .connect("mongodb://localhost:27017/ExplainabilityDataBase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// סכימת המשתמש שלך
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// פונקציה לעדכון סיסמאות
async function updatePasswords() {
  try {
    const users = await User.find(); // שולף את כל המשתמשים מהמאגר

    for (const user of users) {
      if (!user.password.startsWith("$2b$")) {
        // בודק אם הסיסמה כבר מוצפנת
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        await user.save();
        console.log(`Password for user ${user.username} updated`);
      } else {
        console.log(`Password for user ${user.username} is already encrypted`);
      }
    }

    console.log("All passwords updated!");
    process.exit(); // סיום התהליך
  } catch (error) {
    console.error("Error updating passwords:", error);
    process.exit(1); // סיום התהליך עם שגיאה
  }
}

// קריאה לפונקציה
updatePasswords();
