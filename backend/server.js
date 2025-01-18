const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // ייבוא morgan

// הגדרות בסיסיות
const app = express();
app.use(cors()); // מאפשר בקשות ממקורות שונים
app.use(bodyParser.json());
app.use(morgan('dev')); // מוסיף לוגים של בקשות HTTP

// חיבור ל-MongoDB
mongoose
  .connect('mongodb://localhost:27017/ExplainabilityDataBase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// סכימת משתמש
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // שם משתמש (ייחודי)
  fullName: { type: String, required: true }, // שם מלא
  title: { type: String, enum: ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'None'], default: 'None' }, // תואר
  licenseId: { type: String, default: null }, // מספר רישיון רפואי (אופציונלי)
  specialty: { type: String, default: null }, // מומחיות רפואית (אופציונלי)
  phoneNumber: { type: String, default: null }, // מספר טלפון (אופציונלי)
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // מצב חשבון
  gender: { type: String, enum: ['male', 'female'], required: true }, // מין (זכר/נקבה)
  email: { type: String, default: null }, // כתובת מייל (אופציונלי)
  profilePictureUrl: { type: String, default: null }, // כתובת תמונת פרופיל (אופציונלי)
  isAdmin: { type: Boolean, default: false }, // האם הוא מנהל
  password: { type: String, required: true }, // סיסמה
});

const User = mongoose.model('User', UserSchema);

// ROUTE 1: קבלת כל המשתמשים
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // שולף את כל המשתמשים מהמאגר
    res.json(users); // מחזיר את הנתונים בפורמט JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ROUTE 2: הוספת משתמש חדש
app.post('/users', async (req, res) => {
  try {
    const { username, fullName, title, licenseId, specialty, phoneNumber, status, gender, email, profilePictureUrl, isAdmin, password } = req.body;

    // בדיקת שדות חובה
    if (!username || !fullName || !gender || !password) {
      return res.status(400).json({ error: 'Missing required fields: username, fullName, gender, or password' });
    }

    // יצירת משתמש חדש
    const newUser = new User({
      username,
      fullName,
      title,
      licenseId,
      specialty,
      phoneNumber,
      status,
      gender,
      email,
      profilePictureUrl,
      isAdmin,
      password,
    });

    await newUser.save(); // שמירה ב-DB
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// ROUTE 3: עדכון סטטוס של משתמש
app.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    // חיפוש המשתמש לפי ID
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // עדכון סטטוס המשתמש ל-'active' או 'inactive'
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.json(user); // מחזיר את המשתמש המעודכן
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// ROUTE 4: מחיקת משתמש
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // מחיקת המשתמש לפי ID
    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ROUTE 5: עדכון פרטים כלליים של משתמש
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // חיפוש המשתמש לפי ID ועדכון הפרטים
    const updatedUser = await User.findOneAndUpdate({ _id: id }, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser); // מחזיר את המשתמש המעודכן
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// הפעלת השרת
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
