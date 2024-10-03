import { test, expect } from "@playwright/test";

test.describe("Password Reset API Endpoints", () => {
  test("should send password reset email if user exists", async ({
    request,
  }) => {
    const response = await request.post("api/password-reset", {
      data: { email: "testuser@example.com" },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.text();
    expect(responseBody).toContain(
      "Si el correo existe, se enviará un enlace de recuperación."
    );
    
  });

  test("should return 200 even if user does not exist", async ({ request }) => {
    const response = await request.post("api/password-reset", {
      data: { email: "nonexistentuser@example.com" },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.text();
    expect(responseBody).toContain(
      "Si el correo existe, se enviará un enlace de recuperación."
    );
  });

  test("should return 500 if an internal server error occurs", async ({
    request,
  }) => {
    const response = await request.post("api/password-reset", {
      data: { email: "simulate-error@example.com", simulateError: true },
    });

    expect(response.status()).toBe(500);

    const responseBody = await response.text();
    expect(responseBody).toBe("Error enviando el correo de recuperación");
  });
});
