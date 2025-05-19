const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/ExplainabilityDataBase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));


const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // Unique username
  fullName: { type: String, required: true }, // Full name is required
  password: { type: String, required: true }, // Password
});

const User = mongoose.model("User", UserSchema);

// Function to encrypt all plaintext passwords
async function updatePasswords() {
  try {
    const users = await User.find(); // Fetch all users from the database

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with "$2b$")
      if (!user.password.startsWith("$2b$")) {
        // Check if the password is already hashed
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(user.password, salt); // Hash the password

        user.password = hashedPassword; // Update password with hashed version
        await user.save(); // Save changes to the database
        console.log(`Password for user ${user.username} updated`);
      } else {
        console.log(`Password for user ${user.username} is already encrypted`);
      }
    }

    console.log("All passwords updated!");
    process.exit(); // Exit the process cleanly
  } catch (error) {
    console.error("Error updating passwords:", error);
    process.exit(1); // Exit with error code
  }
}

// Run the password update function
updatePasswords();