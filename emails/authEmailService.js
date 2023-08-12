import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({name, email, token}) {
  // console.log('desde send email')

  const transporter = createTransport(
    "sandbox.smtp.mailtrap.io",
    2525,
    "ac851712869f60",
    "59957951d8c996"
  );

  // enviar el email
  const info = await transporter.sendMail({
    from: "AppSalon",
    // va a llegar a mailtrap no a gmail ni emails validos
    to: "correo@correo.com",
    subject: "AppSalon - Confirma tu cuenta",
    text: "AppSalon - Confirma tu cuenta",
    html: `<p>Hola: ${name}, confirma tu cuenta en AppSalon</p>
    <p>Tu cuenta esta casi lista, solo debes confirmarla en el siguiente enlace</p>
    <a href="http://localhost:4000/api/auth/verify/${token}">Confirmar cuenta</a>
    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });

  console.log("Mensaje enviado", info.messageId);
}
