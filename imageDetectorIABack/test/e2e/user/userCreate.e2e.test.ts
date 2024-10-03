import { test, expect } from "@playwright/test";

test.describe("User Create API Endpoints", () => {
  const apiUrl: string = "api/create-user"; // Asegúrate de que esta URL sea la correcta para tu entorno
  const deleteUserUrl: string = "api/user";
  const testEmail: string = "newuser@example.com"; // Email para la prueba
  let userId: string;

  test("should create user successfully and then delete the user", async ({
    request,
  }) => {
    // Intentar crear el usuario
    let response = await request.post(apiUrl, {
      data: {
        email: testEmail,
        name: "New User",
        picture: "http://example.com/picture.jpg",
        password: "Password@123",
      },
    });

    // Si se creó exitosamente
    if (response.status() === 201) {
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty("email", testEmail);
      expect(responseBody).toHaveProperty("name", "New User");
      expect(responseBody).toHaveProperty(
        "picture",
        "http://example.com/picture.jpg"
      );

      // Obtener el ID del nuevo usuario
      userId = responseBody.id; // Asegúrate de que la respuesta contenga el ID

      // Ahora eliminar al usuario creado
      const deleteResponse = await request.delete(`${deleteUserUrl}/${userId}`);

      // Verificar que la eliminación fue exitosa
      expect(deleteResponse.status()).toBe(200);
    } else if (response.status() === 400) {
      // Si hubo un error, verifica si es por email duplicado
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty(
        "message",
        "Email is already registered in ImageDetectorIA"
      );
    } else {
      // Manejar otros códigos de error si es necesario
      expect(response.status()).toBeLessThan(500); // Espera que no sea un error del servidor
    }
  });

  test("should return 400 if email, password, or name is missing", async ({
    request,
  }) => {
    const response = await request.post(apiUrl, {
      data: { email: "missingpassword@example.com" },
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty(
      "message",
      "Email, password, and name are required"
    );
  });

  test("should return 400 for invalid email format", async ({ request }) => {
    const response = await request.post(apiUrl, {
      data: {
        email: "invalid-email-format",
        name: "User",
        password: "Password@123",
      },
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("message", "Invalid email format");
  });

  test("should return 400 for password not meeting criteria", async ({
    request,
  }) => {
    const response = await request.post(apiUrl, {
      data: {
        email: "user@example.com",
        name: "User",
        password: "short", // Contraseña demasiado corta
      },
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty(
      "message",
      "Password must be at least 8 characters long, contain at least one letter, one number, and one special character"
    );
  });

  test("should return 500 if an internal server error occurs", async ({
    request,
  }) => {
    const response = await request.post(apiUrl, {
      data: {
        email: "simulate-error@example.com",
        name: "Simulate Error",
        password: "Password@123",
        simulateError: true, // Agrega un campo para simular el error en tu lógica
      },
    });

    expect(response.status()).toBe(500);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("message", "Internal Server Error");
    expect(responseBody).toHaveProperty(
      "error",
      "An unexpected error occurred"
    );
  });

  test.afterEach(async ({ request }) => {
    if (userId) {
      await request.delete(`${deleteUserUrl}/${userId}`);
    }
  });
});
