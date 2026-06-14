import { successResponse } from '../../../shared/utils/response.js';

export const getAdminDashboard = async (req, res) => {
  return successResponse(res, {
    message: 'Acesso liberado para o painel de administração.',
    admin: {
      id: req.user.id,
      name: req.user.nome,
      email: req.user.email,
    },
  });
};
