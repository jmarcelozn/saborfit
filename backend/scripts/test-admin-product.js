const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const ADMIN_EMAIL = 'admin@saborfit.local';
const ADMIN_PASSWORD = 'Admin123!';

const fetchClient = globalThis.fetch || (await import('undici')).fetch;
let cookieJar = '';

function parseSetCookie(setCookieHeader) {
  if (!setCookieHeader) {
    return '';
  }

  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  return cookies
    .map((cookieString) => cookieString.split(';', 1)[0].trim())
    .filter(Boolean)
    .join('; ');
}

async function request(path, options = {}) {
  const requestUrl = new URL(path.replace(/^\//, ''), `${BACKEND_URL}/`).toString();

  let response;

  try {
    response = await fetchClient(requestUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieJar ? { Cookie: cookieJar } : {}),
        ...options.headers,
      },
      ...options,
    });
  } catch (error) {
    throw new Error(`fetch failed (${requestUrl}): ${error.message}`);
  }

  const setCookieHeader = response.headers.get?.('set-cookie') || response.headers.get?.('Set-Cookie');
  if (setCookieHeader) {
    const newCookies = parseSetCookie(setCookieHeader);
    if (newCookies) {
      cookieJar = cookieJar ? `${cookieJar}; ${newCookies}` : newCookies;
    }
  }

  const body = await response.json().catch(() => null);

  return { status: response.status, body };
}

async function login() {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, senha: ADMIN_PASSWORD }),
  });

  if (result.status !== 200) {
    throw new Error(`Falha no login admin: ${result.status} - ${JSON.stringify(result.body)}`);
  }

  return result.body;
}

async function run() {
  console.log('Iniciando teste de produtos com usuário admin...');

  await login();
  console.log('Login admin realizado com sucesso.');

  const productPayload = {
    name: 'Produto de Teste SaborFit',
    description: 'Descrição de teste para o produto.',
    price: 59.9,
    cost_price: 30.0,
    category_id: null,
    stock_quantity: 100,
    is_active: true,
  };

  const createResponse = await request('/products', {
    method: 'POST',
    body: JSON.stringify(productPayload),
  });

  if (createResponse.status !== 201) {
    throw new Error(`Falha ao criar produto: ${createResponse.status} - ${JSON.stringify(createResponse.body)}`);
  }

  console.log('Produto criado com sucesso:', createResponse.body.data);

  const productId = createResponse.body.data.id;

  const listResponse = await request('/products', {
    method: 'GET',
  });

  console.log('Lista de produtos obtida:', listResponse.body.data.length);

  const updateResponse = await request(`/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ price: 49.9, stock_quantity: 90 }),
  });

  if (updateResponse.status !== 200) {
    throw new Error(`Falha ao atualizar produto: ${updateResponse.status} - ${JSON.stringify(updateResponse.body)}`);
  }

  console.log('Produto atualizado com sucesso:', updateResponse.body.data);

  const deleteResponse = await request(`/products/${productId}`, {
    method: 'DELETE',
  });

  if (deleteResponse.status !== 200) {
    throw new Error(`Falha ao desativar produto: ${deleteResponse.status} - ${JSON.stringify(deleteResponse.body)}`);
  }

  console.log('Produto desativado com sucesso.');

  console.log('Teste de produtos admin concluído com sucesso.');
}

run().catch((error) => {
  console.error('Teste de produto falhou:', error.message);
  process.exit(1);
});
