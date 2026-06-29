export const name = '011_add_cart_delivery_fields';

export async function up(connection) {
  await connection.query(`
    ALTER TABLE carrinhos
    ADD COLUMN observacoes TEXT NULL,
    ADD COLUMN data_entrega DATE NULL
  `);
}

export async function down(connection) {
  await connection.query(`
    ALTER TABLE carrinhos
    DROP COLUMN observacoes,
    DROP COLUMN data_entrega
  `);
}
