export const generateOtpEmail = (
  otp,
  type = "signup",
  colors = {
    primary: "#3b82f6",        // blue-500
    primaryLight: "#eff6ff",   // blue-50
    primaryBorder: "#93c5fd",  // blue-300
  }
) => {
  const messages = {
    signup: {
      title: "Verify Your Email",
      description:
        "Use the One-Time Password (OTP) below to complete your signup.",
    },
    resend: {
      title: "Your New OTP Code",
      description:
        "Here is your new One-Time Password (OTP). Use it to continue verification.",
    },
  };

  const { title, description } = messages[type] || messages.signup;

  return `
  <div style="font-family: Arial, sans-serif; background-color: #f5f6fa; padding: 40px;">
    <div style="
      margin: auto; background: #fff; padding: 30px; 
      border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);
    ">

      <h2 style="text-align: center; color: ${colors.primary}; margin-bottom: 15px;">
        ${title}
      </h2>

      <p style="text-align: center; color: #555; font-size: 15px; margin-bottom: 25px;">
        ${description}
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <div style="
          display: inline-block; font-size: 32px; font-weight: 600;
          background: ${colors.primaryLight}; padding: 16px 32px;
          border-radius: 8px; border: 1px dashed ${colors.primaryBorder};
          letter-spacing: 4px; color: ${colors.primary};
        ">
          ${otp}
        </div>
      </div>

      <p style="text-align: center; color: #666; font-size: 14px;">
        This OTP is valid for <strong>5 minutes</strong>.<br>
        If you did not request this, you can safely ignore this email.
      </p>

      <div style="margin-top: 35px; text-align: center; color: #aaa; font-size: 13px;">
        — This is an automated message —
      </div>

    </div>
  </div>
  `;
};
