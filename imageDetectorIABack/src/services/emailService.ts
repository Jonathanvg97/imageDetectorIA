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
  // debug: true, // Activa el modo de depuración
  // logger: true, // Muestra los logs de la actividad SMTP
});

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: envs.EMAIL_USER,
    to,
    subject: "Recuperación de Contraseña ImageDetectorIA",
    html: `
      <h1>Restablecer Contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="https://tu-dominio.com/reset-password?token=${token}">
        Restablecer Contraseña
      </a>
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
