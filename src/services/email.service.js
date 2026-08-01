import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({ email, firstName, token }) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",

    html: `
      <h2>Password Reset</h2>

      <p>Hello ${firstName},</p>

      <p>You requested to reset your password.</p>

      <p>
        <a href="${resetLink}">
          Reset Password
        </a>
      </p>

      <p>
        This link expires in 15 minutes.
      </p>

      <p>
        If you didn't request this, ignore this email.
      </p>
    `,
  });
};
