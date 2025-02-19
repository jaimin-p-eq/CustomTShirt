import axios from "axios";

const SendOTP = async (email, name, subject, htmlContent) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;

  // console.log( "email", email)
  // console.log("name",name)
  // console.log( "subject", subject)
  // console.log("textcontent" ,textContent)

  if (!brevoApiKey || !senderEmail) {
    console.error("❌ Missing API Key or Sender Email");
    return {
      success: false,
      message: "Server error: Missing email configuration",
    };
  }

  const data = {
    sender: { email: senderEmail, name },
    to: [{ email }],
    subject,
    htmlContent,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    return {
      success: false,
      message: error.message || "OTP sending failed",
    };
  }
};

export default SendOTP;
