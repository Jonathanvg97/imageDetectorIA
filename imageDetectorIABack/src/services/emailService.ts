import nodemailer from "nodemailer";
import { envs } from "../config/envs";

// Configura el transportador de Nodemailer con las credenciales correctas
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: envs.EMAIL_USER,
    pass: envs.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Función para enviar el correo de restablecimiento de contraseña
export const sendPasswordResetEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: envs.EMAIL_USER, // El correo del remitente
    to, // El correo del destinatario
    subject: "Recuperación de Contraseña - ImageDetectorIA",
    html: `
      <h1>Restablecer Contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="https://tu-dominio.com/reset-password?token=${token}">
        Restablecer Contraseña
      </a>
    `,
  };

  try {
    // Enviar el correo con await para manejar correctamente el envío
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente");
  } catch (error) {
    console.error("Error enviando el correo:", error);
    // Lanza un error para que el controlador lo maneje adecuadamente
    throw new Error("No se pudo enviar el correo");
  }
};
