import pool from "../../../../src/config/bd/bd";
import { updateUser } from "../../../../src/services/userService";
import { UserUpdate } from "../../../../src/types/updateUserInterface";

jest.mock("../../../../src/config/bd/bd");

describe("updateUser", () => {
  it("should update a user's fields and return the updated user", async () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000"; // ID de usuario de ejemplo
    const updateFields: UserUpdate = {
      name: "Updated Name",
      picture: "updated_picture_url.jpg",
    };

    const mockUpdatedUser = {
      id: userId,
      name: "Updated Name",
      picture: "updated_picture_url.jpg",
    };

    // Mockeamos la respuesta de la consulta de actualización
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [mockUpdatedUser],
      rowCount: 1, // Cantidad de filas actualizadas
    });

    // Ejecutamos la función
    const result = await updateUser(userId, updateFields);

    // Verificaciones
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE users"),
      [userId, updateFields.name, updateFields.picture]
    );
    // Manejar el caso de null
    expect(result).not.toBeNull();
    if (result) {
      expect(result.rows[0]).toEqual(mockUpdatedUser);
    }
  });

  it("should throw an error if no fields to update are provided", async () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000"; // ID de usuario de ejemplo
    const updateFields: UserUpdate = {}; // Sin campos para actualizar

    // Verificamos que se lance un error
    await expect(updateUser(userId, updateFields)).rejects.toThrow(
      "No fields to update"
    );
  });
});
