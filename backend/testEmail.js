require("dotenv").config();
const { sendEmail } = require("./utils/emailService");

(async () => {
  const result = await sendEmail({
    to: " ", // enter mail before run to check.
    subject: "Test from MediClear ICU",
    text: "This is a test email from MediClear ICU server.",
  });

  console.log(result ? "✅ Test email sent successfully" : "❌ Failed to send test email");
})();
