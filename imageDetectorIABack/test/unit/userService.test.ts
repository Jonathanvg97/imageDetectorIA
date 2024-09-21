// test/unit/userService.test.ts
import { getUserById } from "./userService";

describe("UserService", () => {
  it("debería devolver un usuario válido para un ID correcto", () => {
    const user = getUserById(1);
    expect(user).toEqual({ id: 1, name: "Test User" });
  });

  it("debería lanzar un error para un ID inválido", () => {
    expect(() => getUserById(-1)).toThrow("Invalid ID");
  });

  it("debería ser capaz de devolver un usuario para un ID correcto sin errores", () => {
    expect(() => getUserById(1)).not.toThrow();
  });
});
