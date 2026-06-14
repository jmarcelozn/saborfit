export const name = '004_ensure_email_unique';

export async function up(connection) {
  try {
    // Tenta adicionar o constraint UNIQUE (será ignorado se já existir)
    await connection.query(`
      ALTER TABLE usuarios
      ADD CONSTRAINT uk_usuarios_email UNIQUE (email)
    `);
  } catch (error) {
    // Se o erro for "Duplicate key name" ou similar, o constraint já existe
    if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_MULTIPLE_PRIMARY_KEY') {
      console.log('Constraint uk_usuarios_email já existe');
    } else {
      throw error;
    }
  }
}

export async function down(connection) {
  try {
    await connection.query(`
      ALTER TABLE usuarios
      DROP INDEX uk_usuarios_email
    `);
  } catch (error) {
    // Se o índice não existir, ignora o erro
    if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
      console.log('Índice uk_usuarios_email não existe');
    } else {
      throw error;
    }
  }
}
