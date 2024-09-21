// src/services/userService.ts
export const getUserById = (id: number) => {
    if (id <= 0) {
      throw new Error('Invalid ID');
    }
    return { id, name: 'Test User' };
  };
  