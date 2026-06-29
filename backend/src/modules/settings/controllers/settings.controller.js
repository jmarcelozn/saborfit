import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.js';
import settingsService from '../services/settings.service.js';

export const getStoreSettings = asyncHandler(async (_req, res) => {
  const settings = await settingsService.getStoreSettings();
  return successResponse(res, settings);
});

export const updateStoreSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateStoreSettings(req.body);
  return successResponse(res, settings, 'Configurações atualizadas com sucesso');
});
