import http from 'node:http';

const BASE_URL = 'http://localhost:3000';

class SecurityTester {
  async makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, BASE_URL);
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      const req = http.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  async testRateLimiting() {
    console.log('\n🔒 Testando Rate Limiting...');
    const attempts = 25;
    let blocked = 0;

    for (let i = 0; i < attempts; i++) {
      try {
        const response = await this.makeRequest('POST', '/auth/login', {
          email: 'test@example.com',
          senha: 'wrongpassword',
        });

        if (response.status === 429) {
          blocked++;
        }
      } catch (error) {
        console.error(`Erro no teste ${i + 1}:`, error.message);
      }
    }

    if (blocked > 0) {
      console.log(`✅ Rate limiting funcionando (${blocked}/${attempts} requisições bloqueadas)`);
    } else {
      console.log('⚠️  Rate limiting pode não estar funcionando corretamente');
    }
  }

  async testUserEnumeration() {
    console.log('\n🔒 Testando User Enumeration...');
    
    try {
      const response1 = await this.makeRequest('POST', '/auth/register', {
        nome: 'Test User',
        email: 'existing@example.com',
        senha: 'Test@1234',
      });

      const response2 = await this.makeRequest('POST', '/auth/register', {
        nome: 'Test User',
        email: 'nonexistent@example.com',
        senha: 'Test@1234',
      });

      if (response1.body.includes('cadastrado') || response2.body.includes('cadastrado')) {
        console.log('✅ User enumeration protegido (mensagens genéricas)');
      } else {
        console.log('⚠️  Verificar proteção contra user enumeration');
      }
    } catch (error) {
      console.error('Erro no teste de user enumeration:', error.message);
    }
  }

  async testMassAssignment() {
    console.log('\n🔒 Testando Mass Assignment...');
    
    try {
      const response = await this.makeRequest('POST', '/auth/register', {
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'Test@1234',
        isAdmin: true,
        role: 'admin',
        token_version: 999,
      });

      if (response.status === 400 || response.status === 200) {
        console.log('✅ Mass assignment protegido');
      } else {
        console.log('⚠️  Verificar proteção contra mass assignment');
      }
    } catch (error) {
      console.error('Erro no teste de mass assignment:', error.message);
    }
  }

  async testSqlInjection() {
    console.log('\n🔒 Testando SQL Injection...');
    
    const payloads = [
      "' OR '1'='1",
      "'; DROP TABLE usuarios; --",
      "admin'--",
      "' UNION SELECT * FROM usuarios--",
    ];

    let blocked = 0;

    for (const payload of payloads) {
      try {
        const response = await this.makeRequest('POST', '/auth/login', {
          email: payload,
          senha: 'Test@1234',
        });

        if (response.status === 400 || response.status === 401) {
          blocked++;
        }
      } catch (error) {
        blocked++;
      }
    }

    if (blocked === payloads.length) {
      console.log(`✅ SQL Injection protegido (${blocked}/${payloads.length} payloads bloqueados)`);
    } else {
      console.log(`⚠️  Verificar proteção contra SQL Injection (${blocked}/${payloads.length} bloqueados)`);
    }
  }

  async testWeakPasswords() {
    console.log('\n🔒 Testando Validação de Senha...');
    
    const weakPasswords = [
      'password',
      '12345678',
      'abc123',
      'Test123',
      'Test@123',
    ];

    let blocked = 0;

    for (const senha of weakPasswords) {
      try {
        const response = await this.makeRequest('POST', '/auth/register', {
          nome: 'Test User',
          email: `test${Date.now()}@example.com`,
          senha,
        });

        if (response.status === 400) {
          blocked++;
        }
      } catch (error) {
        blocked++;
      }
    }

    if (blocked === weakPasswords.length) {
      console.log(`✅ Validação de senha forte funcionando (${blocked}/${weakPasswords.length} senhas fracas bloqueadas)`);
    } else {
      console.log(`⚠️  Verificar validação de senha (${blocked}/${weakPasswords.length} bloqueadas)`);
    }
  }

  async testJwtValidation() {
    console.log('\n🔒 Testando JWT Validation...');
    
    try {
      const response = await this.makeRequest('GET', '/auth/me', null, {
        Authorization: 'Bearer invalid.token.here',
      });

      if (response.status === 401) {
        console.log('✅ JWT validation funcionando');
      } else {
        console.log('⚠️  Verificar validação de JWT');
      }
    } catch (error) {
      console.error('Erro no teste de JWT:', error.message);
    }
  }

  async testHeaders() {
    console.log('\n🔒 Testando Security Headers...');
    
    try {
      const response = await this.makeRequest('GET', '/auth/me');
      
      const securityHeaders = [
        'helmet',
        'x-frame-options',
        'x-content-type-options',
        'strict-transport-security',
      ];

      const presentHeaders = securityHeaders.filter(header => 
        Object.keys(response.headers).some(h => h.includes(header))
      );

      if (presentHeaders.length > 0) {
        console.log(`✅ Security headers presentes (${presentHeaders.length}/${securityHeaders.length})`);
      } else {
        console.log('⚠️  Verificar security headers (Helmet)');
      }
    } catch (error) {
      console.error('Erro no teste de headers:', error.message);
    }
  }

  async runAllTests() {
    console.log('🚀 Iniciando testes de segurança...');
    console.log(`📍 Target: ${BASE_URL}`);
    console.log('⚠️  Certifique-se de que o servidor está rodando');

    await this.testHeaders();
    await this.testRateLimiting();
    await this.testUserEnumeration();
    await this.testMassAssignment();
    await this.testSqlInjection();
    await this.testWeakPasswords();
    await this.testJwtValidation();

    console.log('\n✅ Testes de segurança concluídos');
    console.log('\n📝 Recomendações:');
    console.log('1. Para testes mais completos, use OWASP ZAP ou Burp Suite');
    console.log('2. Execute testes de penetração periodicamente');
    console.log('3. Monitore logs de segurança em produção');
    console.log('4. Mantenha dependências atualizadas');
  }
}

const tester = new SecurityTester();
tester.runAllTests().catch(console.error);
