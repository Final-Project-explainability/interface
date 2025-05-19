<div dir="rtl" align="right">

# MediClear - הוראות הפעלה

## 📌 תוכן עניינים
- [📖 הוראות בעברית](#-הוראות-בעברית)
- [📖 Instructions in English](#-instructions-in-english)
- [🎥 Watch the YouTube Video](#-watch-the-youtube-video)

## 📄 הוראות הפעלה בפורמט PDF
להורדת קובץ ההוראות המלא הכולל הוראות מפורטות עם תמונות, לחצו על הקישור הבא:

[📥 הוראות להפעלת המערכת (PDF)](https://drive.google.com/file/d/1eOMhheNKpBA7aZXNKFa5TDOtDI30anJM/view?usp=drive_link)

---

## 📖 הוראות בעברית

### חיזוי תמותת מטופלים במיון ומתן הסבריות למודלי חיזוי

#### הקדמה  
לפני תחילת העבודה, יש לוודא שיש לכם גישה לפרויקט (לאחר שאישרתם את ההזמנה שקיבלתם ב-GitHub) שנמצא בקישור הבא:  
[https://github.com/Final-Project-explainability](https://github.com/Final-Project-explainability)  
הפרויקט מורכב משני חלקים: `main` ו- `interface`.  
לצורך הפעלת תצוגת המשתמש, נתמקד ברכיב `interface`.

בנוסף, בדקו כי על מחשבכם מותקנות התוכנות הבאות:  
    - *PyCharm*  
    - *MongoDB*

> *שימו לב:* בשלב זה המערכת פועלת *באופן לוקאלי בלבד* ובאופן חלקי (המערכת עודנה בפיתוח).

---

### 1. שיבוט (Clone) של הפרויקט באמצעות GitHub Desktop
1. פתחו את ***GitHub Desktop*** במחשב שלכם.
2. לחצו על ***Add*** ואז על ***...Clone repository***.
3. בחלון שנפתח, חפשו את הפרויקט ***Final-Project-explainability***.
4. בחרו את ***interface*** ולחצו ***Clone***.
5. מומלץ: לחזור על הפעולה ולייבא גם את `main`, אך זה לא חובה.

---

### 2. פתיחת הקוד ב-PyCharm
1. ודאו כי ה- ***Current repository*** הוא `interface`.
2. לחצו על ***Open in JetBrains PyCharm***.

#### 🛠 אם אין לכם אפשרות לפתוח ישירות ב-PyCharm (לא מופיע Open in JetBrains PyCharm)
במידה ואפשרות *Open in JetBrains PyCharm* אינה מופיעה, יש לבצע את הפעולות הבאות:

    1. ב-GitHub Desktop, לחצו על Options.
    2. גשו ללשונית Integrations.
    3. תחת External editor, בחרו JetBrains PyCharm.
    4. לחצו על Save.
    5. כעת, האפשרות אמורה להופיע ולתת לכם לפתוח ישירות את הקוד ב-PyCharm.

---

### 3. הגדרת מסד הנתונים MongoDB
1. פתחו את ***MongoDB*** במחשב.
2. לחצו על ***Save & Connect ← Add new connection*** (אין צורך לשנות הגדרות).
3. לחצו על ***+*** כדי להוסיף *Database* חדש.
4. צרו *Database* בשם **ExplainabilityDataBase** עם אוסף (collection) בשם **users**.
5. לחצו על ***Create Database***.
6. תחת **users**, לחצו על ***Import JSON or CSV file*** ← ***ADD DATA***.
7. טענו את קובץ משתמשי המערכת `users.json` שנמצא בנתיב:
   
<div dir="ltr" align="left">

   
    interface/frontend/public/data/
   
<div dir="rtl" align="right">

   
   (ניתן להגיע לקובץ זה דרך *PyCharm* לאחר פתיחת הפרויקט).
8. לחצו על ***Import***.

---

### 4. התקנת והפעלת השרת
פתחו *Terminal* ובצעו את הפקודות הבאות (תוכלו לנסות להריץ את הפקודות ע"י לחיצה הPLAY המופיע מצד שמאל לפקודה ולפי הסדר, תוך מתן זמן לכל פקודה לסיים את פעולתה):

<div dir="ltr" align="left">

```sh
cd backend
```

```sh
npm install -g nodemon
```

```sh
nodemon server.js
```

```sh
node updatePasswords.js
```
<div dir="rtl" align="right">

> *הערה:* הצפנת הסיסמאות (updatePasswords.js) *הכרחית* לפעולה תקינה של המערכת במידה שהDataBase (mongoDB) לא מכיל נתוני משתמשים כלל (צריך להיות לפחות משתמש אחד לפעילות תקינה של המערכת).

---


### 5. הפעלת ממשק המשתמש (Frontend) - הפעלה לוקאלית
פתחו *Terminal* נוסף ובצעו:

<div dir="ltr" align="left">

```sh
cd frontend
```

```sh
npm run serve
```

<div dir="rtl" align="right">

לאחר סיום ההפעלה, יופיע *קישור לוקאלי* – לחצו עליו לפתיחת המערכת.  
לדוגמה:
http://localhost:8080/  
(קישור זה אינו בהכרח פעיל והוא ***רק דוגמה*** – אין ללחוץ עליו ישירות)

---

## ⚙️ הפעלת המערכת דרך מכונה וירטואלית - שרת האוניברסיטה (חיבור לכתובת https://mediclear.cs.bgu.ac.il/)

בכל פעם שהמכונה (המחשב או השרת) מאותחלת – יש להפעיל ידנית את רכיבי המערכת.

### 🪪 שלב 1: הפעלת MongoDB  
1. פתחו את אפליקציית **MongoDB Compass**.  
2. לחצו על **Connect** (אין צורך לשנות הגדרות).

---

### 🖥 שלב 2: הפעלת שרת ה-Backend  
פתחו טרמינל חדש ובצעו:

<div dir="ltr" align="left">

```sh
cd backend
```
```sh
nodemon server.js
```

---
<div dir="rtl" align="right">

### 🔐 שלב 3: הצפנת סיסמאות (בדרך כלל נדרש רק בפעם הראשונה כאשר הDB ריק)  

<div dir="ltr" align="left">

```sh
node updatePassword.js
```

---

<div dir="rtl" align="right">

### 🖼 שלב 4: הפעלת ממשק המשתמש (Frontend)  
בטרמינל נוסף:

<div dir="ltr" align="left">

```sh
cd frontend
```
```sh
npm install
```
```sh
npm run build
```

---

<div dir="rtl" align="right">

### 🧩 שלב 5: הפעלת שרת NGINX (לאחר הפעלת `npm run build`)

1. פתחו את שורת הפקודה (CMD) או PowerShell **כמנהל מערכת (Run as Administrator)**.
2. עברו לתיקייה הראשית של NGINX:

<div dir="ltr" align="left">

   ```sh
   cd C:\nginx-1.27.4\nginx-1.27.4
   ```

<div dir="rtl" align="right">

3. הפעילו את NGINX:

<div dir="ltr" align="left">

   ```sh
   nginx
   ```

<div dir="rtl" align="right">

4. כעת ניתן לגשת למערכת דרך הדפדפן בכתובת:

<div dir="ltr" align="left">

   [https://mediclear.cs.bgu.ac.il](https://mediclear.cs.bgu.ac.il)

---


<div dir="ltr" align="left">

## 📖 Instructions in English

### Predicting Patient Mortality and Providing Model Explainability

#### Introduction  
Before starting, ensure you have access to the project repository (after accepting the invitation you received on GitHub) at:  
[https://github.com/Final-Project-explainability](https://github.com/Final-Project-explainability)  
The project consists of two parts: `main` and `interface`.  
For running the user interface, we will focus on the `interface` part.

Additionally, make sure the following software is installed on your computer:  
- *PyCharm*  
- *MongoDB*

> *Note:* At this stage, the system runs ***locally only*** and is still **under development**.


---

### 1. Cloning the Project using GitHub Desktop
1. Open ***GitHub Desktop*** on your computer.
2. Click **Add** → ***Clone repository...***.
3. In the window that opens, search for ***Final-Project-explainability***.
4. Select ***interface*** and click ***Clone***.
5. Recommended: Repeat the process to also import `main`, but this is optional.

---

### 2. Opening the Code in PyCharm
1. Ensure that the ***Current repository*** is `interface`.
2. Click ***Open in JetBrains PyCharm***.

#### 🛠 If "Open in JetBrains PyCharm" does not appear
If the *Open in JetBrains PyCharm* option is missing, follow these steps:

    1. In GitHub Desktop, click Options.
    2. Go to the Integrations tab.
    3. Under External editor, select JetBrains PyCharm.
    4. Click Save.
    5. Now, the option should appear, allowing you to open the code directly in PyCharm.

---

### 3. Setting Up the MongoDB Database
1. Open ***MongoDB Compass*** on your computer.
2. Click ***Add new connection → Save & Connect*** (no need to change settings).
3. Click ***+*** to create a ***Database***.
4. Name it ***ExplainabilityDataBase*** and create a collection named ***users***.
5. Click ***Create Database***.
6. Under users, click ***ADD DATA*** → ***Import JSON or CSV file***.
7. Load the user data file `users.json` located at:
   
   
    interface/frontend/public/data/
   
   
   (You can access this file through *PyCharm* after opening the project).
8. Click ***Import***.

---

### 4. Installing and Running the Server
Open *Terminal* and run the following commands, ensuring that the root directory you are in is interface:

```sh
cd backend
```

```sh
npm install -g nodemon
```

```sh
nodemon server.js
```

```sh
node updatePasswords.js
```

> *Note:* Encrypting passwords (updatePassword.js) is *essential* for the system to function properly.

---

### 5. Running the Frontend Interface - Local only!
Open ***a new Terminal*** and run:

```sh
cd frontend
```

```sh
npm run serve
```

Once completed, a ***local link*** will appear – click on it to open the system.  
For example:  http://localhost:8080/ 

(This link is just an example format and may not be functional — do not click on it directly.)

</div>

---

## ⚙️ Running the System on the University Server (Virtual Machine Access at https://mediclear.cs.bgu.ac.il/)

Whenever the server (or virtual machine) restarts, the following components must be manually launched.

---

### 🪪 Step 1: Launch MongoDB
1. Open the **MongoDB Compass** application.
2. Click **Connect** (no need to change any settings).

---

### 🖥 Step 2: Start the Backend Server
Open a terminal and run the following commands:

```sh
cd backend
```
```sh
nodemon server.js
```

---

### 🔐 Step 3: Encrypt User Passwords  
> Usually required only the **first time**, if the MongoDB database is empty or has unencrypted passwords.

In the same or new terminal:

```sh
node updatePasswords.js
```

---

### 🖼 Step 4: Build the Frontend
In a new terminal:

```sh
cd frontend
```
```sh
npm install
```
```sh
npm run build
```


---

### 🧩 Step 5: Start the NGINX Server

1. Open **Command Prompt (CMD)** or **PowerShell** as **Administrator** (Right click → "Run as Administrator").

2. Navigate to the NGINX directory:

```sh
cd C:\nginx-1.27.4\nginx-1.27.4
```

3. Start the NGINX server:

```sh
nginx
```

---

### 🌐 Step 6: Access the System

Once NGINX is running, the system will be accessible in your browser via:

[https://mediclear.cs.bgu.ac.il](https://mediclear.cs.bgu.ac.il)

---

## 🎥 Watch the YouTube Video
Click on the image below to watch the explanation video on YouTube.

[![Watch the video](https://img.youtube.com/vi/xw0PxcqokEs/0.jpg)](https://youtu.be/xw0PxcqokEs?si=LUlh8J6q7njrmpd2)