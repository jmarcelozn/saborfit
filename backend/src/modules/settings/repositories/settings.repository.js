import pool from '../../../database/pool.js';

const SETTINGS_ID = 1;

const SELECT_FIELDS = `
  id,
  nome_loja,
  descricao,
  email,
  whatsapp,
  instagram,
  endereco,
  created_at,
  updated_at
`;

export class SettingsRepository {
  async findStoreSettings() {
    const [rows] = await pool.query(
      `SELECT ${SELECT_FIELDS}
       FROM configuracoes_loja
       WHERE id = ?
       LIMIT 1`,
      [SETTINGS_ID],
    );

    return rows[0] || null;
  }

  async upsertStoreSettings(data) {
    const existing = await this.findStoreSettings();

    if (!existing) {
      await pool.query(
        `INSERT INTO configuracoes_loja (
          id,
          nome_loja,
          descricao,
          email,
          whatsapp,
          instagram,
          endereco
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          SETTINGS_ID,
          data.nome_loja,
          data.descricao,
          data.email,
          data.whatsapp,
          data.instagram,
          data.endereco,
        ],
      );
    } else {
      await pool.query(
        `UPDATE configuracoes_loja
         SET
           nome_loja = ?,
           descricao = ?,
           email = ?,
           whatsapp = ?,
           instagram = ?,
           endereco = ?,
           updated_at = NOW()
         WHERE id = ?`,
        [
          data.nome_loja,
          data.descricao,
          data.email,
          data.whatsapp,
          data.instagram,
          data.endereco,
          SETTINGS_ID,
        ],
      );
    }

    return this.findStoreSettings();
  }
}

export default new SettingsRepository();
