Arquitetura Backend - SaborFit
Visão Geral

O SaborFit utiliza uma Arquitetura Modular orientada a Domínio (Domain Modular Architecture), com separação clara de responsabilidades entre camadas.

O objetivo é:

Facilitar manutenção.
Reduzir acoplamento.
Aumentar reutilização de código.
Permitir crescimento do sistema sem perda de organização.
Garantir testabilidade e previsibilidade.
Estrutura do Projeto
src/
│
├── config/
├── database/
├── routes/
├── shared/
│
└── modules/
    │
    ├── auth/
    ├── users/
    ├── products/
    ├── categories/
    ├── cart/
    ├── orders/
    ├── payments/
    ├── addresses/
    └── admin/
Diretórios Globais
config/

Centraliza todas as configurações da aplicação.

config/
│
├── auth.ts
├── database.ts
├── mail.ts
├── upload.ts
└── env.ts
Responsabilidades
Configuração JWT.
Variáveis de ambiente.
Configuração MySQL.
Configuração SMTP.
Configuração Upload.
Regra

Nenhuma regra de negócio pode existir aqui.

database/

Responsável pela infraestrutura do banco.

database/
│
├── connection.ts
│
├── migrations/
│
├── seeds/
│
└── factories/
Responsabilidades
Conexão MySQL.
Migrations.
Seeds.
Factories para testes.
Regra

Nenhuma regra de negócio.

routes/

Ponto central das rotas.

routes/
│
└── index.ts
Exemplo
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
Regra

Apenas registrar rotas.

shared/

Componentes reutilizáveis.

shared/
│
├── errors/
│
├── middlewares/
│
├── utils/
│
├── validators/
│
├── types/
│
├── constants/
│
└── dtos/
errors/

Padronização de erros.

class AppError extends Error {
    constructor(
        public message: string,
        public statusCode = 400
    ) {
        super(message);
    }
}
middlewares/
middlewares/
│
├── ensureAuthenticated.ts
├── ensureAdmin.ts
├── errorHandler.ts
└── rateLimiter.ts
validators/

Validações reutilizáveis.

Exemplo:

validateCPF()
validateEmail()
validatePassword()
utils/

Funções auxiliares.

utils/
│
├── slug.ts
├── date.ts
├── currency.ts
└── pagination.ts
Estrutura dos Módulos

Cada módulo representa um contexto de negócio.

Exemplo:

products/

Toda funcionalidade relacionada a produtos deve permanecer dentro desse módulo.

Estrutura Interna do Módulo
products/
│
├── infra/
│
├── repositories/
│
├── services/
│
├── controllers/
│
├── dtos/
│
├── validators/
│
└── tests/
Camadas do Módulo
infra/

Responsável pela comunicação com tecnologias externas.

infra/
│
├── entities/
│   └── Product.ts
│
├── routes/
│   └── products.routes.ts
│
└── schemas/
Responsabilidades
Models.
Rotas.
Integrações externas.
Regra

Não implementar regra de negócio.

repositories/

Responsável pela persistência.

repositories/
│
├── IProductsRepository.ts
│
└── ProductsRepository.ts
Exemplo
interface IProductsRepository {
    create(data: CreateProductDTO): Promise<Product>;
    findById(id: string): Promise<Product | null>;
}
Benefícios
Facilita testes.
Permite trocar ORM futuramente.
Segue princípio DIP (SOLID).
services/

Camada mais importante do sistema.

services/
│
├── CreateProductService.ts
├── UpdateProductService.ts
├── DeleteProductService.ts
└── ListProductsService.ts
Responsabilidades
Regras de negócio.
Validações de fluxo.
Orquestração.
Exemplo
class CreateProductService {
    constructor(
        private repository: IProductsRepository
    ) {}

    async execute(data: CreateProductDTO) {
        const productExists =
            await this.repository.findBySku(data.sku);

        if (productExists) {
            throw new AppError(
                "SKU já cadastrado"
            );
        }

        return this.repository.create(data);
    }
}
controllers/

Entrada HTTP.

controllers/
│
├── CreateProductController.ts
└── ListProductsController.ts
Exemplo
class CreateProductController {
    async handle(
        request: Request,
        response: Response
    ) {
        const service =
            container.resolve(
                CreateProductService
            );

        const result =
            await service.execute(
                request.body
            );

        return response.status(201).json(result);
    }
}
Regra

Controller não contém:

SQL
Regras de negócio
Validações complexas
Fluxo Obrigatório
Request
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
MySQL

Retorno:

MySQL
   │
   ▼
Repository
   │
   ▼
Service
   │
   ▼
Controller
   │
   ▼
Response
Estrutura Recomendada para E-commerce
modules/
│
├── auth/
├── users/
├── profiles/
│
├── categories/
├── products/
├── product-media/
├── inventory/
│
├── cart/
├── orders/
├── order-items/
│
├── payments/
├── coupons/
│
├── addresses/
├── shipping/
│
├── notifications/
│
└── admin/
Convenções de Nomenclatura
Services
CreateProductService
UpdateProductService
DeleteProductService
FindProductService
ListProductsService
Controllers
CreateProductController
UpdateProductController
DeleteProductController
Repositories
ProductsRepository
UsersRepository
OrdersRepository
Boas Práticas Obrigatórias
SOLID
SRP → Um arquivo, uma responsabilidade.
OCP → Evitar alterar código existente.
DIP → Services dependem de interfaces.
Tratamento de Erros

Sempre utilizar:

throw new AppError(
    "Mensagem",
    400
);

Nunca:

throw new Error();
Banco de Dados

Proibido:

SELECT * FROM products

Preferir:

SELECT
    id,
    name,
    price
FROM products
Performance

Utilizar índices para:

email
sku
category_id
product_id
user_id
order_id
created_at
status
Paginação

Toda listagem deve ser paginada.

GET /products?page=1&limit=20
Soft Delete

Produtos e usuários não devem ser removidos fisicamente.

deleted_at DATETIME NULL
Arquitetura Final Recomendada
Controller
    ↓
DTO
    ↓
Validator
    ↓
Service
    ↓
Repository Interface
    ↓
Repository
    ↓
MySQL