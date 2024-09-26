import nodemailer from "nodemailer";
import { envs } from "../../../../../src/config/envs";
import { sendPasswordResetEmail } from "../../../../../src/services/emailService";

// Mock de nodemailer
jest.mock("nodemailer", () => {
  const sendMailMock = jest.fn((_, callback) =>
    callback(null, { messageId: "mockMessageId" })
  );
  const verifyMock = jest.fn((callback) => callback(null, true));

  return {
    createTransport: jest.fn(() => ({
      sendMail: sendMailMock,
      verify: verifyMock,
    })),
  };
});

describe("sendPasswordResetEmail - Unit Test", () => {
  it("should verify the transporter and send the email", async () => {
    const to = "test@example.com";
    const token = "mockToken";

    // Llama a la función para enviar el correo
    await sendPasswordResetEmail(to, token);

    // Verifica que el transportador fue verificado
    expect(nodemailer.createTransport).toHaveBeenCalled();

    // Verifica que se envió el correo con las opciones correctas
    const mailOptions = {
      from: `"ImageDetectorIA" <${envs.EMAIL_USER}>`,
      to,
      subject: "Recuperación de Contraseña ImageDetectorIA",
      html: expect.stringContaining(`reset-password?token=${token}`),
    };

    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      expect.objectContaining(mailOptions),
      expect.any(Function)
    );
  });

  it("should throw an error if sending fails", async () => {
    // Simula un error en el envío del correo
    (nodemailer.createTransport().sendMail as jest.Mock).mockImplementationOnce(
      (_, callback) => callback(new Error("Error enviando el correo"), null)
    );

    const to = "test@example.com";
    const token = "mockToken";

    await expect(sendPasswordResetEmail(to, token)).rejects.toThrow(
      "No se pudo enviar el correo"
    );
  });
});
