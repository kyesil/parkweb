import { Offer } from '@/db/schema';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const adminEMail = process.env.ADMIN_EMAIL;

async function sendEmail(toEmail: string | string[], subject: string, html: string) {
  return await resend.emails.send({
    from: 'Domain Offers <noreply@voltar.uk>',
    to: toEmail,
    subject: subject,
    html: html
  });
}
export function generateVerifyCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
export async function sendVerify(email: string, code: string, domain: string) {

  return sendEmail(email, `Verification Code for ${domain} Offer`, `
    <div>
    <h2>Verify Your Offer for ${domain}</h2>
    <p>Your verification code is:</p>
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
      <strong>${code}</strong>
    </div>
    <p>This code will expire in 15 minutes.</p>
    <p>If you didn't request this code, please ignore this email.</p>
    </div>
    `);

}
function jsontohtml(json: any) {
  let html = "<ul>";
  for (let key in json) {
    html += "<li>" + key + ": <pre>" + json[key] + "</pre></li>";
  }
  html += "</ul>";
  return html;
}
export async function sendOffer(offer: Offer) {
  if (!adminEMail)
    return {data:null, error: "Admin email not found" };

  return sendEmail(adminEMail, `New offer for ${offer.domain}`, `
    <div>
    <h2>Your Offer for ${offer.domain}: </h2>
    ${jsontohtml(offer)}
    </div>
      
    `);

}