import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.js';
import adminUsersService from '../services/adminUsers.service.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await adminUsersService.getUsers();

  return successResponse(
    res,
    users,
    'Usuários carregados com sucesso'
  );
});

export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await adminUsersService.updateRole(
    Number(id),
    role
  );

  return successResponse(
    res,
    user,
    'Permissão atualizada com sucesso'
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await adminUsersService.deleteUser(
    Number(id)
  );

  return successResponse(
    res,
    null,
    'Usuário removido com sucesso'
  );
});