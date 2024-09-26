import pool from "../../../../../src/config/bd/bd";
import { deleteUser } from "../../../../../src/services/userService";

jest.mock("../../../../../src/config/bd/bd");

describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  it("should delete a user and return rowCount", async () => {
    // Se mockea la respuesta de la consulta de eliminación
    const mockRowCount = 1; // Simula que un registro fue eliminado
    (pool.query as jest.Mock).mockResolvedValue({
      rowCount: mockRowCount,
    });

    const userId = "123e4567-e89b-12d3-a456-426614174000"; // Un ID de usuario de ejemplo
    const result = await deleteUser(userId);

    // Verificaciones
    expect(pool.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [
      userId,
    ]);
    expect(result).toEqual({ rowCount: mockRowCount });
  });

  it("should return 0 rowCount if no rows were deleted", async () => {
    // Mockeamos la respuesta de la consulta de eliminación para simular que no se eliminó ningún registro
    (pool.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
    });

    const userId = "123e4567-e89b-12d3-a456-426614174000"; // Un ID de usuario de ejemplo
    const result = await deleteUser(userId);

    // Verificaciones
    expect(pool.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [
      userId,
    ]);
    expect(result).toEqual({ rowCount: 0 });
  });

  it("should return 0 rowCount if query result is null", async () => {
    // Mockeamos la respuesta de la consulta de eliminación para simular un resultado nulo
    (pool.query as jest.Mock).mockResolvedValue({
      rowCount: null, // Simulamos un caso donde rowCount es nulo
    });

    const userId = "123e4567-e89b-12d3-a456-426614174000"; // Un ID de usuario de ejemplo
    const result = await deleteUser(userId);

    // Verificaciones
    expect(pool.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [
      userId,
    ]);
    expect(result).toEqual({ rowCount: 0 });
  });
});
