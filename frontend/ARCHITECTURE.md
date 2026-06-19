# ARCHITECTURE.md

# Arquitetura Oficial do Frontend

## Objetivo

Este documento define a arquitetura oficial do frontend e deve ser considerado a fonte única de verdade para qualquer modificação, correção, refatoração ou implementação de novas funcionalidades.

Toda alteração realizada no projeto deve respeitar integralmente as regras descritas neste documento.

Em caso de conflito entre uma implementação existente e esta documentação, a implementação deverá ser adaptada para seguir a arquitetura definida aqui.

---

# Princípios Arquiteturais

Toda implementação deve seguir obrigatoriamente:

* SOLID
* Clean Code
* Separation of Concerns
* Single Responsibility Principle
* Baixo acoplamento
* Alta coesão
* Reutilização controlada
* Modularização
* Escalabilidade
* Manutenibilidade
* Legibilidade
* Testabilidade

Não são permitidas soluções temporárias, gambiarras ou implementações que violem estes princípios.

---

# Estrutura Oficial do Projeto

```txt
src/
├── app/
├── features/
├── shared/
├── assets/
├── styles/
├── main.jsx
└── App.jsx
```

Cada diretório possui uma responsabilidade específica e obrigatória.

---

# Camada App

A pasta `app` contém exclusivamente elementos globais da aplicação.

Tudo que existe apenas uma vez e pode ser utilizado por qualquer módulo deve permanecer nesta camada.

Exemplos:

```txt
app/
├── routes/
├── providers/
├── contexts/
├── services/
├── config/
├── guards/
└── layouts/
```

---

## app/routes

Responsável pelo roteamento global.

Permitido:

* React Router
* Configuração de rotas
* Agrupamento de rotas públicas e privadas

Proibido:

* Regras de negócio
* Chamadas HTTP
* Manipulação de estado

---

## app/providers

Responsável pelos providers globais.

Exemplos:

* AuthProvider
* ThemeProvider
* QueryProvider
* NotificationProvider

---

## app/contexts

Responsável apenas por contextos globais.

Exemplos:

* Autenticação
* Tema
* Idioma
* Carrinho global

Não criar contextos específicos de features.

---

## app/services

Responsável apenas por infraestrutura compartilhada.

Exemplos:

* Axios Instance
* API Client
* Interceptors
* Storage
* Cookies
* LocalStorage
* SessionStorage

Proibido:

* Regras de negócio
* Transformações específicas de domínio

---

## app/config

Responsável pelas configurações globais.

Exemplos:

* Variáveis de ambiente
* Constantes globais
* Configuração de permissões
* Configuração de rotas

---

## app/guards

Responsável pela proteção de rotas.

Exemplos:

* AuthGuard
* GuestGuard
* RoleGuard

---

## app/layouts

Responsável pelos layouts globais.

Exemplos:

* PublicLayout
* AdminLayout
* UserLayout

---

# Camada Features

A pasta `features` contém as funcionalidades de negócio do sistema.

Cada feature representa um domínio independente.

Exemplos:

```txt
features/
├── auth/
├── products/
├── cart/
├── orders/
├── users/
└── admin/
```

Uma feature deve conter tudo que é necessário para funcionar de forma isolada.

---

# Estrutura padrão de uma Feature

```txt
feature-name/
├── pages/
├── components/
├── hooks/
├── services/
├── validations/
├── utils/
├── types/
└── index.js
```

---

## pages

Contém páginas da feature.

Responsabilidade:

* Composição da interface
* Integração entre componentes

Proibido:

* Regras complexas de negócio
* Chamadas HTTP diretas
* Transformações complexas de dados

---

## components

Contém componentes exclusivos da feature.

Se um componente for utilizado por mais de uma feature, ele deve ser movido para `shared/components`.

---

## hooks

Contém hooks específicos da feature.

Exemplos:

```txt
useProducts
useCreateProduct
useCart
useCheckout
```

Toda lógica reutilizável deve ser extraída para hooks.

---

## services

Responsável pela comunicação externa da feature.

Exemplos:

* chamadas HTTP
* mapeamento de DTOs
* adaptação de payloads
* serialização e desserialização

---

## validations

Responsável pelas validações da feature.

Exemplos:

* schemas Zod
* schemas Yup
* validações customizadas

---

## utils

Funções auxiliares específicas da feature.

Não mover para shared sem reutilização comprovada.

---

## types

Responsável pelos tipos da feature.

Exemplos:

* DTOs
* Responses
* Interfaces
* Types

---

# Camada Shared

A pasta `shared` contém recursos reutilizáveis por múltiplas features.

Regra obrigatória:

Se um recurso for utilizado por duas ou mais features, ele deve ser movido para shared.

---

## shared/components

Componentes reutilizáveis.

Exemplos:

```txt
Button
Input
Modal
Loader
Header
Footer
Table
Pagination
```

---

## shared/hooks

Hooks genéricos reutilizáveis.

Exemplos:

```txt
useDebounce
usePagination
useLocalStorage
```

---

## shared/utils

Funções utilitárias compartilhadas.

Exemplos:

```txt
formatCurrency
formatDate
formatPhone
```

---

## shared/constants

Constantes compartilhadas.

Exemplos:

```txt
routes
roles
permissions
```

---

## shared/validations

Validações compartilhadas.

Exemplos:

```txt
emailSchema
passwordSchema
```

---

## shared/types

Tipos compartilhados.

Exemplos:

```txt
ApiResponse
Pagination
BaseEntity
```

---

# Regras de Dependência

A seguinte direção de dependência deve ser respeitada:

```txt
app
 ↓
features
 ↓
shared
```

Regras obrigatórias:

* App pode utilizar Features e Shared.
* Features podem utilizar Shared.
* Shared não pode depender de Features.
* Shared não pode depender de App.
* Features não podem depender diretamente de outras Features.
* Comunicação entre Features deve ocorrer por serviços compartilhados, contextos globais ou estado global.

---

# Regras para Novas Implementações

Antes de criar qualquer arquivo, verificar:

1. O recurso é global?

   * Criar em app.

2. O recurso pertence a apenas uma funcionalidade?

   * Criar dentro da feature correspondente.

3. O recurso será utilizado por múltiplas funcionalidades?

   * Criar em shared.

---

# Regras para Refatorações

Toda refatoração deve:

* Reduzir acoplamento.
* Melhorar legibilidade.
* Melhorar reutilização.
* Melhorar organização.
* Preservar comportamento existente.
* Seguir esta arquitetura.

---

# Regras para Inteligências Artificiais

Ao gerar, modificar ou remover código:

1. Ler este documento antes de qualquer alteração.
2. Não criar novas pastas sem justificativa arquitetural.
3. Não violar as regras de dependência.
4. Não duplicar lógica existente.
5. Não mover arquivos para locais incompatíveis com esta arquitetura.
6. Priorizar modularização e escalabilidade.
7. Sempre utilizar a estrutura definida neste documento como referência principal.

Este documento possui prioridade máxima para decisões arquiteturais do frontend.
