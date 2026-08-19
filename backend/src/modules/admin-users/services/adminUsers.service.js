import adminUsersRepository from '../repositories/adminUsers.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';

class AdminUsersService {
  async getUsers() {
    return await adminUsersRepository.findAll();
  }

  async getUserById(id) {
    const user = await adminUsersRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return user;
  }

  async updateRole(id, role) {
    if (!role) {
      throw new AppError('Função é obrigatória', 400);
    }

    const allowedRoles = ['admin', 'user'];

    if (!allowedRoles.includes(role)) {
      throw new AppError('Função inválida', 400);
    }

    const user = await adminUsersRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return await adminUsersRepository.updateRole(id, role);
  }

  async deleteUser(id) {
    const user = await adminUsersRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Check if user has orders
    const hasOrders = await adminUsersRepository.userHasOrders(id);
    
    if (hasOrders) {
      throw new AppError('Não é possível excluir este usuário pois existem pedidos associados a ele.', 400);
    }

    await adminUsersRepository.delete(id);

    return {
      success: true,
      message: 'Usuário removido com sucesso',
    };
  }
}

export default new AdminUsersService();