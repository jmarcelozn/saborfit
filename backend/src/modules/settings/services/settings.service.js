import settingsRepository from '../repositories/settings.repository.js';

function normalizeOptionalText(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeWhatsapp(value) {
  const text = normalizeOptionalText(value);

  if (!text) {
    return null;
  }

  const digits = text.replace(/\D/g, '');
  return digits.length > 0 ? digits : null;
}

function normalizeInstagram(value) {
  const text = normalizeOptionalText(value);

  if (!text) {
    return null;
  }

  return text.replace(/^@/, '');
}

function mapStoreSettings(row) {
  if (!row) {
    return {
      store_name: null,
      description: null,
      email: null,
      whatsapp: null,
      instagram: null,
      address: null,
      updated_at: null,
    };
  }

  return {
    store_name: row.nome_loja || null,
    description: row.descricao || null,
    email: row.email || null,
    whatsapp: row.whatsapp || null,
    instagram: row.instagram || null,
    address: row.endereco || null,
    updated_at: row.updated_at || null,
  };
}

export class SettingsService {
  async getStoreSettings() {
    const row = await settingsRepository.findStoreSettings();
    return mapStoreSettings(row);
  }

  async updateStoreSettings(payload) {
    const data = {
      nome_loja: normalizeOptionalText(payload.store_name),
      descricao: normalizeOptionalText(payload.description),
      email: normalizeOptionalText(payload.email)?.toLowerCase() || null,
      whatsapp: normalizeWhatsapp(payload.whatsapp),
      instagram: normalizeInstagram(payload.instagram),
      endereco: normalizeOptionalText(payload.address),
    };

    const row = await settingsRepository.upsertStoreSettings(data);
    return mapStoreSettings(row);
  }
}

export default new SettingsService();
