import nodemailer from "nodemailer";
import { envs } from "../config/envs";

// Configura el transportador de Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: envs.EMAIL_USER,
    pass: envs.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetPasswordUrl = `${envs.FRONTEND_BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"ImageDetectorIA" <${envs.EMAIL_USER}>`,
    to,
    subject: "Recuperación de Contraseña ImageDetectorIA",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      
      <h1 style="color: #333;">Hola, ${to}</h1>
      <p style="color: #555;">
        Hemos recibido una solicitud para restablecer tu contraseña. Si no solicitaste este cambio, puedes ignorar este mensaje.
      </p>
      <p style="color: #555;">
        Para restablecer tu contraseña, por favor haz clic en el botón de abajo:
      </p>
      <div style="text-align: center; margin: 20px 0;">
          <a href="${resetPasswordUrl}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
          Restablecer Contraseña
        </a>
      </div>
      <p style="color: #555;">
        Si tienes algún problema, por favor contacta a nuestro equipo de soporte.
      </p>
      <p style="color: #777; font-size: 12px;">
        © 2024 ImageDetectorIA. Todos los derechos reservados.
      </p>
    </div>
  `,
  };

  // Verificar la configuración del transportador
  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.error(
          "Error al verificar la configuración del transportador:",
          error
        );
        reject(error);
      } else {
        console.log("El servidor está listo para enviar correos");
        resolve(success);
      }
    });
  });

  // Intentar enviar el correo
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error enviando el correo:", err);
          reject(err);
        } else {
          console.log("Correo enviado correctamente:", info);
          resolve(info);
        }
      });
    });
  } catch (error) {
    console.error("Error enviando el correo:", error);
    throw new Error("No se pudo enviar el correo");
  }
};
