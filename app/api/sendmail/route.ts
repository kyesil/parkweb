import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, verificationCode, domainName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Domain Park <noreply@your-domain.com>',
      to: email,
      subject: 'Verify your domain offer',
      html: `
        <h2>Verify Your Offer for ${domainName}</h2>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>Please enter this code to complete your offer submission.</p>
      `,
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error });
  }
} 