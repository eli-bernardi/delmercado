# 📋 Del Mercado — Documento de Requisitos do Sistema

> **Versão:** 1.0.0  
> **Data:** Agosto de 2026  
> **Autor:** Eliel Bernardi  
> **Empresa:** Del Company  
> **Projeto:** Del Mercado — Sistema de Compras Interno  

---

## 📌 Sumário

- [1. Visão Geral do Sistema](#1-visão-geral-do-sistema)
- [2. Regras de Negócio](#2-regras-de-negócio)
- [3. Requisitos Funcionais](#3-requisitos-funcionais)
- [4. Requisitos Não Funcionais](#4-requisitos-não-funcionais)
- [5. Casos de Uso Principais](#5-casos-de-uso-principais)
- [6. Restrições e Premissas](#6-restrições-e-premissas)

---

## 1. Visão Geral do Sistema

O **Del Mercado** é um sistema web Full Stack desenvolvido para centralizar o gerenciamento de usuários, produtos, movimentações de estoque e relatórios gerenciais de uma rede varejista.

A aplicação adota arquitetura **REST API**, com backend em **Node.js + Express**, banco de dados **MySQL (Sequelize ORM)** e frontend em **HTML5 + CSS3 + JavaScript Vanilla**.

---

## 2. Regras de Negócio

### 🔵 RN-01 — Estoque Mínimo Crítico
> O sistema deve considerar como **estoque crítico** qualquer produto com quantidade disponível **inferior a 10 unidades**.  
> Esses produtos devem ser sinalizados no relatório de produtos críticos.

---

### 🔵 RN-02 — Validação de Saída de Estoque
> Não é permitido registrar uma **saída de estoque** quando a quantidade solicitada for **maior do que o saldo disponível** do produto.  
> O sistema deve validar automaticamente o saldo antes de registrar a movimentação.

---

### 🔵 RN-03 — Tipos de Movimentação
> Toda movimentação deve ser classificada obrigatoriamente em um dos dois tipos:
> - **Entrada** — acréscimo na quantidade em estoque.
> - **Saída** — redução na quantidade em estoque.

---

### 🔵 RN-04 — Campos Obrigatórios no Cadastro de Usuário
> Para o cadastro de um usuário, os seguintes campos são **obrigatórios**:
> - Nome
> - Sobrenome
> - Idade
> - E-mail (deve ser único no sistema)
> - Telefone
> - Endereço
> - Cidade
> - Estado

---

### 🔵 RN-05 — Unicidade de E-mail
> O sistema não deve permitir o cadastro de dois usuários com o **mesmo endereço de e-mail**.  
> O campo de e-mail é tratado como identificador único de usuário.

---

### 🔵 RN-06 — Campos Obrigatórios no Cadastro de Produto
> Para o cadastro de um produto, os seguintes campos são **obrigatórios**:
> - Nome do produto
> - Preço
> - Quantidade inicial em estoque
> - Categoria

---

### 🔵 RN-07 — Registro de Data e Horário nas Movimentações
> Toda movimentação de estoque deve registrar automaticamente a **data e o horário** em que foi realizada.  
> Essa informação não deve ser editável pelo usuário.

---

### 🔵 RN-08 — Importação Automática via DummyJSON
> O sistema deve ser capaz de importar dados de usuários e produtos diretamente da **API pública DummyJSON**.  
> A importação em lote deve ser realizada através de um endpoint dedicado (`/bulk`).  
> Dados importados duplicados (e-mail ou ID já existente) devem ser ignorados sem causar erro fatal.

---

### 🔵 RN-09 — Integridade Referencial nas Movimentações
> Uma movimentação de compra deve estar vinculada a um **produto existente** no sistema.  
> Não é permitido registrar movimentações para produtos que não existam no cadastro.

---

### 🔵 RN-10 — Exclusão de Registros
> A exclusão de um **usuário** ou **produto** deve ser permanente (hard delete).  
> O sistema deve exibir uma confirmação antes de efetuar a exclusão.

---

## 3. Requisitos Funcionais

### 👤 Módulo de Usuários

| ID     | Requisito                                                                                     | Prioridade |
|--------|-----------------------------------------------------------------------------------------------|------------|
| RF-01  | O sistema deve permitir o **cadastro** de novos usuários com todos os campos obrigatórios.    | Alta       |
| RF-02  | O sistema deve permitir a **listagem** de todos os usuários cadastrados.                       | Alta       |
| RF-03  | O sistema deve permitir a **consulta individual** de um usuário pelo seu ID.                  | Alta       |
| RF-04  | O sistema deve permitir a **busca de usuário por nome**.                                       | Média      |
| RF-05  | O sistema deve permitir a **atualização** dos dados de um usuário existente.                  | Alta       |
| RF-06  | O sistema deve permitir a **exclusão** de um usuário pelo seu ID.                             | Alta       |
| RF-07  | O sistema deve importar usuários automaticamente através da **API DummyJSON** (`/usuarios/bulk`). | Média   |

---

### 📦 Módulo de Produtos

| ID     | Requisito                                                                                     | Prioridade |
|--------|-----------------------------------------------------------------------------------------------|------------|
| RF-08  | O sistema deve permitir o **cadastro** de novos produtos com todos os campos obrigatórios.   | Alta       |
| RF-09  | O sistema deve permitir a **listagem** de todos os produtos cadastrados.                       | Alta       |
| RF-10  | O sistema deve permitir a **consulta individual** de um produto pelo seu ID.                  | Alta       |
| RF-11  | O sistema deve permitir a **busca de produto por nome**.                                       | Média      |
| RF-12  | O sistema deve permitir a **atualização** dos dados de um produto existente.                  | Alta       |
| RF-13  | O sistema deve permitir a **exclusão** de um produto pelo seu ID.                             | Alta       |
| RF-14  | O sistema deve importar produtos automaticamente através da **API DummyJSON** (`/produtos/bulk`). | Média   |

---

### 🛒 Módulo de Movimentações (Compras)

| ID     | Requisito                                                                                           | Prioridade |
|--------|-----------------------------------------------------------------------------------------------------|------------|
| RF-15  | O sistema deve permitir o **registro de entradas** de estoque para um produto.                       | Alta       |
| RF-16  | O sistema deve permitir o **registro de saídas** de estoque para um produto.                         | Alta       |
| RF-17  | O sistema deve **validar automaticamente** o saldo disponível antes de registrar uma saída.          | Alta       |
| RF-18  | O sistema deve registrar automaticamente a **data e horário** de cada movimentação.                  | Alta       |
| RF-19  | O sistema deve exibir o **histórico completo** de todas as movimentações realizadas.                  | Alta       |
| RF-20  | O sistema deve **atualizar automaticamente** o saldo do produto após cada movimentação.               | Alta       |

---

### 📊 Módulo de Relatórios

| ID     | Requisito                                                                                            | Prioridade |
|--------|------------------------------------------------------------------------------------------------------|------------|
| RF-21  | O sistema deve gerar o relatório de **produtos com estoque crítico** (quantidade inferior a 10).      | Alta       |
| RF-22  | O sistema deve gerar o relatório de **volume financeiro movimentado por produto**.                    | Alta       |
| RF-23  | O sistema deve fornecer dados consolidados para **geração de gráficos analíticos**.                   | Alta       |
| RF-24  | O sistema deve exibir os **top 5 produtos** com maior movimentação financeira.                        | Média      |
| RF-25  | O sistema deve listar os **produtos mais movimentados** em quantidade.                                | Média      |

---

### 📈 Dashboard

| ID     | Requisito                                                                                            | Prioridade |
|--------|------------------------------------------------------------------------------------------------------|------------|
| RF-26  | O sistema deve exibir o **total de usuários** cadastrados no dashboard.                               | Alta       |
| RF-27  | O sistema deve exibir o **total de produtos** cadastrados no dashboard.                               | Alta       |
| RF-28  | O sistema deve exibir o **total de movimentações** realizadas no dashboard.                           | Alta       |
| RF-29  | O sistema deve permitir a **pesquisa em tempo real** de usuários e produtos no dashboard.             | Média      |
| RF-30  | O sistema deve disponibilizar um **botão de importação automática** de dados no dashboard.            | Média      |

---

### 📉 Gráficos

| ID     | Requisito                                                                                            | Prioridade |
|--------|------------------------------------------------------------------------------------------------------|------------|
| RF-31  | O sistema deve exibir gráfico de **barras verticais** com a quantidade de estoque por produto.        | Alta       |
| RF-32  | O sistema deve exibir gráfico de **barras horizontais** com o volume financeiro por produto.          | Alta       |
| RF-33  | Os dados dos gráficos devem ser **atualizados automaticamente** ao carregar a página de gráficos.     | Média      |

---

## 4. Requisitos Não Funcionais

### ⚡ Desempenho

| ID      | Requisito                                                                                               | Prioridade |
|---------|---------------------------------------------------------------------------------------------------------|------------|
| RNF-01  | A API deve responder às requisições em até **2 segundos** em condições normais de carga.                 | Alta       |
| RNF-02  | A listagem de produtos e usuários deve suportar pelo menos **500 registros** sem degradação perceptível. | Média      |
| RNF-03  | O dashboard deve carregar em no máximo **3 segundos** após a abertura da página.                         | Alta       |

---

### 🔒 Segurança

| ID      | Requisito                                                                                               | Prioridade |
|---------|---------------------------------------------------------------------------------------------------------|------------|
| RNF-04  | A API deve utilizar o middleware **CORS** para controlar as origens autorizadas a consumir os endpoints. | Alta       |
| RNF-05  | Os dados sensíveis de configuração (senha do banco, porta) devem ser armazenados em **variáveis de ambiente** (`.env`). | Alta |
| RNF-06  | O sistema não deve expor mensagens de erro técnico detalhadas ao usuário final.                          | Média      |
| RNF-07  | O arquivo `.env` deve estar listado no `.gitignore` para não ser versionado no repositório.              | Alta       |

---

### 🛠️ Manutenibilidade

| ID      | Requisito                                                                                               | Prioridade |
|---------|---------------------------------------------------------------------------------------------------------|------------|
| RNF-08  | O código do backend deve seguir o padrão de arquitetura **MVC** (Model, View, Controller).               | Alta       |
| RNF-09  | O código deve estar organizado em módulos separados por responsabilidade (controllers, models, routes).  | Alta       |
| RNF-10  | O projeto deve possuir um arquivo **README.md** com instruções de instalação e uso.                      | Alta       |
| RNF-11  | O projeto deve utilizar **versionamento de código via Git** com histórico de commits rastreável.         | Alta       |

---

### 🌐 Compatibilidade

| ID      | Requisito                                                                                               | Prioridade |
|---------|---------------------------------------------------------------------------------------------------------|------------|
| RNF-12  | O frontend deve ser compatível com os navegadores **Google Chrome, Firefox e Microsoft Edge** (versões modernas). | Alta |
| RNF-13  | O sistema deve funcionar corretamente em **Node.js versão 16 ou superior**.                              | Alta       |
| RNF-14  | O banco de dados deve ser compatível com **MySQL versão 8.0 ou superior**.                               | Alta       |

---

### 📡 Disponibilidade e Infraestrutura

| ID      | Requisito                                                                                               | Prioridade |
|---------|---------------------------------------------------------------------------------------------------------|------------|
| RNF-15  | A API deve ser executada localmente na porta **3000** por padrão (configurável via `.env`).              | Alta       |
| RNF-16  | O banco de dados deve ter suas tabelas criadas automaticamente pelo **Sequelize** na primeira inicialização. | Alta    |
| RNF-17  | O servidor deve ser reiniciado automaticamente em modo de desenvolvimento utilizando o **Nodemon**.       | Baixa      |

---

### 🎨 Usabilidade

| ID      | Requisito                                                                                               | Prioridade |
|---------|---------------------------------------------------------------------------------------------------------|------------|
| RNF-18  | A interface deve adotar o padrão visual **Glassmorphism** com design moderno e responsivo.               | Alta       |
| RNF-19  | O sistema deve fornecer **mensagens de feedback** ao usuário após operações de cadastro, atualização e exclusão. | Alta |
| RNF-20  | A navegação entre módulos deve ser intuitiva e realizada por meio de **menu de navegação lateral ou superior**. | Alta |
| RNF-21  | Os formulários devem realizar **validação dos campos obrigatórios** antes de enviar os dados para a API. | Alta       |

---

### 🔗 Integração

| ID      | Requisito                                                                                               | Prioridade |
|---------|---------------------------------------------------------------------------------------------------------|------------|
| RNF-22  | O sistema deve integrar-se à **API pública DummyJSON** para importação de dados de usuários e produtos. | Alta       |
| RNF-23  | A comunicação entre frontend e backend deve ser realizada exclusivamente via **API REST** com formato **JSON**. | Alta |

---

## 5. Casos de Uso Principais

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DEL MERCADO                      │
├────────────────────┬────────────────────────────────────────┤
│      ATOR          │           CASOS DE USO                  │
├────────────────────┼────────────────────────────────────────┤
│                    │ - Cadastrar Usuário                     │
│                    │ - Listar Usuários                       │
│                    │ - Consultar Usuário por ID              │
│   Usuário do       │ - Atualizar Usuário                     │
│   Sistema          │ - Excluir Usuário                       │
│   (Operador)       │ - Cadastrar Produto                     │
│                    │ - Listar Produtos                       │
│                    │ - Registrar Entrada de Estoque          │
│                    │ - Registrar Saída de Estoque            │
│                    │ - Visualizar Relatórios                 │
│                    │ - Visualizar Gráficos                   │
│                    │ - Importar Dados via DummyJSON           │
├────────────────────┼────────────────────────────────────────┤
│   API DummyJSON    │ - Fornecer dados de usuários (bulk)     │
│   (Sistema Externo)│ - Fornecer dados de produtos (bulk)     │
└────────────────────┴────────────────────────────────────────┘
```

---

## 6. Restrições e Premissas

### Restrições

- O sistema foi desenvolvido como **protótipo piloto** para fins acadêmicos e de demonstração.
- Não há módulo de **autenticação e controle de acesso** na versão atual.
- O frontend é servido estaticamente, sem servidor dedicado (uso do Live Server ou equivalente).
- O banco de dados deve estar disponível localmente; não há suporte a banco em nuvem nesta versão.

### Premissas

- O operador possui acesso à máquina com Node.js, MySQL e browser moderno instalados.
- A conexão com a internet é necessária apenas para a funcionalidade de importação via DummyJSON.
- Os dados importados pelo DummyJSON são utilizados apenas para fins de demonstração e testes.

---

## 📝 Histórico de Versões

| Versão | Data           | Descrição                                  | Autor           |
|--------|----------------|--------------------------------------------|-----------------|
| 1.0.0  | Agosto/2026    | Criação inicial do documento de requisitos | Eliel Bernardi  |

---

<div align="center">

**Del Mercado — Documento de Requisitos**  
© 2026 — Del Company | Eliel Bernardi

</div>
