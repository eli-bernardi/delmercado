# 🛒 Del Mercado - Sistema de Compras Interno

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

Sistema web **Full Stack** para gerenciamento de compras, estoque, usuários, produtos e relatórios analíticos. Desenvolvido como protótipo piloto para uma rede varejista, utilizando arquitetura REST, banco de dados MySQL e interface web integrada.

---

# 📋 Índice

- [🚀 Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Objetivos](#-objetivos)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [📦 Pré-requisitos](#-pré-requisitos)
- [⚙️ Instalação e Configuração](#️-instalação-e-configuração)
- [🔗 Endpoints da API](#-endpoints-da-api)
- [🎯 Funcionalidades](#-funcionalidades)
- [🖥️ Telas do Sistema](#️-telas-do-sistema)
- [🧪 Testes](#-testes)
- [🤝 Contribuição](#-contribuição)
- [📝 Licença](#-licença)
- [📞 Contato](#-contato)

---

# 🚀 Sobre o Projeto

O **Del Mercado** é um sistema web desenvolvido para centralizar o gerenciamento de usuários, produtos, movimentações de estoque e relatórios gerenciais em um único ambiente.

A aplicação foi criada como um **protótipo piloto**, simulando o funcionamento de um sistema interno utilizado por redes varejistas para controlar entradas e saídas de produtos, manter o cadastro de usuários e disponibilizar indicadores estratégicos por meio de gráficos e relatórios.

Toda a comunicação entre frontend e backend ocorre através de uma **API REST**, utilizando o banco de dados **MySQL** para armazenamento permanente das informações.

---

# 🎯 Objetivos

- ✅ Centralizar o gerenciamento de produtos.
- ✅ Gerenciar usuários do sistema.
- ✅ Controlar movimentações de estoque.
- ✅ Importar dados automaticamente utilizando a API DummyJSON.
- ✅ Disponibilizar relatórios estratégicos.
- ✅ Exibir gráficos analíticos para tomada de decisão.
- ✅ Demonstrar uma arquitetura Full Stack utilizando Node.js, Express e MySQL.

---
# 🛠️ Tecnologias Utilizadas

## Backend

| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Ambiente de execução JavaScript |
| **Express.js** | Framework para construção da API REST |
| **Sequelize** | ORM para comunicação com o banco de dados |
| **MySQL** | Banco de dados relacional |
| **CORS** | Middleware para permitir requisições entre diferentes origens |

---

## Frontend

| Tecnologia | Descrição |
|------------|-----------|
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização completa utilizando Glassmorphism |
| **JavaScript (Vanilla)** | Consumo da API e interações da interface |
| **Chart.js** | Construção dos gráficos analíticos |

---

## Ferramentas

| Ferramenta | Utilização |
|------------|------------|
| Git | Versionamento do projeto |
| GitHub | Hospedagem do repositório |
| VS Code | Ambiente de desenvolvimento |
| REST Client | Testes dos endpoints |
| Nodemon | Reinicialização automática do servidor |

---

# 📁 Estrutura do Projeto

```text
del-mercado/
├── backend/
│   ├── controller/
│   │   ├── compra.controller.js
│   │   ├── produto.controller.js
│   │   └── usuario.controller.js
│   ├── db/
│   │   └── conn.js
│   ├── models/
│   │   ├── Compra.js
│   │   ├── Produto.js
│   │   └── Usuario.js
│   ├── routes/
│   │   ├── compra.routes.js
│   │   ├── produto.routes.js
│   │   └── usuario.routes.js
│   ├── index.js
│   ├── package.json
│   └── teste.http
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── html/
│   │   ├── index.html
│   │   ├── produtos.html
│   │   ├── usuarios.html
│   │   ├── movimentacoes.html
│   │   ├── relatorios.html
│   │   └── graficos.html
│   └── js/
│       ├── main.js
│       ├── usuario/
│       │   ├── listar.js
│       │   ├── cadastrar.js
│       │   ├── consultar.js
│       │   ├── atualizar.js
│       │   └── apagar.js
│       └── produto/
│           ├── listar.js
│           ├── cadastrar.js
│           ├── consultar.js
│           ├── atualizar.js
│           └── apagar.js
├── img/
│   └── dell.png
├── .gitignore
└── README.md
```

---
# 📦 Pré-requisitos

Antes de executar o projeto, certifique-se de possuir os seguintes softwares instalados em sua máquina:

| Software | Versão Recomendada |
|----------|--------------------|
| Node.js | 16 ou superior |
| MySQL | 8.0 ou superior |
| Git | Última versão |
| VS Code | Recomendado |
| REST Client (Extensão) | Opcional para testes |

---

# ⚙️ Instalação e Configuração

## 1. Clone o repositório

```bash
git clone https://github.com/eli-bernardi/del-mercado.git
```

Entre na pasta do projeto:

```bash
cd del-mercado
```

Caso o `package.json` esteja localizado na pasta **backend**, entre nela:

```bash
cd backend
```

---

## 2. Instale as dependências

```bash
npm install
```

---

## 3. Configure o banco de dados

Abra o MySQL e execute:

```sql
CREATE DATABASE db_compras;
```

---

## 4. Configure as variáveis de ambiente

Crie um arquivo chamado **.env** na pasta **backend** contendo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=db_compras
```

Substitua **sua_senha** pela senha do seu usuário do MySQL.

---

## 5. Inicialização do banco

Ao iniciar o servidor pela primeira vez, o sistema utilizará o Sequelize para criar automaticamente as tabelas necessárias.

Caso existam Views SQL utilizadas pelo projeto, execute os scripts correspondentes antes da utilização do sistema.

---

## 6. Inicie o servidor

```bash
npm run dev
```

ou

```bash
node index.js
```

caso não utilize o Nodemon.

Após iniciar, a API estará disponível em:

```text
http://localhost:3000
```

---

## 7. Execute o Frontend

Abra o arquivo

```text
frontend/html/index.html
```

utilizando o **Live Server** do VS Code ou qualquer servidor HTTP de sua preferência.

---
# 🔗 Endpoints da API

A API do **Del Mercado** segue o padrão REST, utilizando os métodos HTTP para manipulação dos recursos.

---

# 👤 Usuários

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | `/usuarios` | Lista todos os usuários cadastrados |
| GET | `/usuarios/:id` | Retorna um usuário específico |
| POST | `/usuarios` | Cadastra um novo usuário |
| PUT | `/usuarios/:id` | Atualiza um usuário existente |
| DELETE | `/usuarios/:id` | Remove um usuário |
| POST | `/usuarios/bulk` | Importa usuários da DummyJSON |

---

# 📦 Produtos

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca um produto pelo ID |
| POST | `/produtos` | Cadastra um novo produto |
| PUT | `/produtos/:id` | Atualiza um produto |
| DELETE | `/produtos/:id` | Remove um produto |
| POST | `/produtos/bulk` | Importa produtos da DummyJSON |

---

# 🛒 Compras / Movimentações

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | `/compras` | Lista todas as movimentações |
| POST | `/compras` | Registra uma nova movimentação |

---

# 📊 Relatórios

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | `/compras/relatorios/produtos-criticos` | Produtos com estoque &lt; 10 |
| GET | `/compras/relatorios/volume-compras` | Volume financeiro movimentado por produto |
| GET | `/compras/relatorios/graficos` | Dados utilizados pelos gráficos |

---

# 📥 Exemplo de Requisição

## Cadastrar Usuário

```http
POST http://localhost:3000/usuarios
Content-Type: application/json

{
    "nome": "João",
    "sobrenome": "Silva",
    "idade": 30,
    "email": "joao@email.com",
    "telefone": "999999999",
    "endereco": "Rua Teste, 123",
    "cidade": "São Paulo",
    "estado": "SP"
}
```

---

## Resposta Esperada

```json
{
    "message": "Usuário cadastrado com sucesso."
}
```

---

## Listar Usuários

```http
GET http://localhost:3000/usuarios
```

---

## Buscar Usuário por ID

```http
GET http://localhost:3000/usuarios/1
```

---

## Atualizar Usuário

```http
PUT http://localhost:3000/usuarios/1
Content-Type: application/json

{
    "nome":"João Atualizado"
}
```

---

## Excluir Usuário

```http
DELETE http://localhost:3000/usuarios/1
```

---
# 🎯 Funcionalidades

O sistema foi desenvolvido utilizando uma arquitetura Full Stack, oferecendo funcionalidades para gerenciamento de usuários, produtos, movimentações de estoque e geração de indicadores estratégicos.

---

# 👤 Módulo de Usuários

O módulo de usuários permite o gerenciamento completo das informações cadastradas.

### Funcionalidades

- ✅ Cadastro de novos usuários
- ✅ Consulta por ID
- ✅ Consulta por nome
- ✅ Listagem completa
- ✅ Atualização de dados
- ✅ Exclusão de usuários
- ✅ Importação automática através da API DummyJSON

---

# 📦 Módulo de Produtos

Responsável pelo gerenciamento de todos os produtos cadastrados no sistema.

### Funcionalidades

- ✅ Cadastro de produtos
- ✅ Consulta individual
- ✅ Busca por nome
- ✅ Atualização de informações
- ✅ Exclusão
- ✅ Importação automática via DummyJSON

---

# 🛒 Movimentações

O módulo de movimentações controla as entradas e saídas do estoque.

### Recursos

- ✅ Entrada de produtos
- ✅ Saída de produtos
- ✅ Validação automática do estoque disponível
- ✅ Histórico completo das movimentações
- ✅ Registro de data e horário

---

# 📊 Relatórios

O sistema gera informações estratégicas para acompanhamento do estoque.

### Relatórios disponíveis

- Produtos com estoque crítico (menor que 10 unidades)
- Volume financeiro por produto
- Produtos mais movimentados
- Histórico de movimentações

---

# 📈 Dashboard

A tela inicial apresenta indicadores importantes para acompanhamento do sistema.

### Recursos disponíveis

- Cards com total de usuários
- Cards com total de produtos
- Cards com movimentações realizadas
- Botão para importação automática
- Pesquisa em tempo real
- Navegação rápida entre módulos

---

# 📉 Gráficos

Os gráficos são desenvolvidos utilizando a biblioteca **Chart.js**.

### Gráfico de Estoque

- Barras verticais
- Quantidade disponível por produto
- Atualização automática

### Volume Financeiro

- Barras horizontais
- Top 5 produtos com maior movimentação financeira

---

# 🖥️ Telas do Sistema

| Tela | Descrição |
|------|-----------|
| Dashboard | Página inicial do sistema |
| Usuários | Cadastro e gerenciamento de usuários |
| Produtos | Cadastro e gerenciamento de produtos |
| Movimentações | Controle de entrada e saída |
| Relatórios | Indicadores estratégicos |
| Gráficos | Visualização analítica |

---

# 🧪 Testes

O projeto acompanha um arquivo chamado:

```text
teste.http
```

Esse arquivo contém requisições prontas para todos os endpoints da API.

Para utilizá-lo:

1. Instale a extensão **REST Client** no Visual Studio Code.
2. Abra o arquivo `teste.http`.
3. Clique em **Send Request** sobre qualquer requisição.
4. Analise o retorno da API diretamente no VS Code.

---

## Exemplo

```http
GET http://localhost:3000/produtos
```

```http
GET http://localhost:3000/usuarios
```

```http
GET http://localhost:3000/compras
```

---
# 🤝 Contribuição

Contribuições são sempre bem-vindas. Caso deseje colaborar com o projeto, siga os passos abaixo:

1. Faça um **Fork** deste repositório.
2. Crie uma nova branch para sua funcionalidade.

```bash
git checkout -b feature/minha-funcionalidade
```

3. Realize as alterações necessárias.

4. Faça o commit.

```bash
git commit -m "Adiciona nova funcionalidade"
```

5. Envie as alterações para seu repositório.

```bash
git push origin feature/minha-funcionalidade
```

6. Abra um **Pull Request** descrevendo as alterações realizadas.

---

# 📝 Licença

Este projeto é distribuído sob a licença **MIT**.

Você pode utilizar, modificar e distribuir este projeto livremente, desde que os créditos ao autor original sejam mantidos.

Para mais informações consulte o arquivo:

```text
LICENSE
```

---

# 👨‍💻 Desenvolvedor

## Eliel Bernardi

Desenvolvedor Full Stack responsável pelo desenvolvimento do projeto **Del Mercado**.

### Contato

📧 **Email**

elielbernardi0012@gmail.com

🐙 **GitHub**

https://github.com/eli-bernardi

📷 **Instagram**

https://www.instagram.com/elielbrnrd/

💼 **Projeto desenvolvido por**

**Del Company**

---

# 📚 Referências

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- Chart.js
- DummyJSON API
- HTML5
- CSS3
- JavaScript (ES6)

---

# 📌 Observações

- O projeto foi desenvolvido para fins acadêmicos e demonstração de uma arquitetura Full Stack baseada em API REST.
- A importação de usuários e produtos utiliza a API pública **DummyJSON**.
- O frontend consome todos os dados diretamente da API desenvolvida em Node.js.
- O banco de dados utilizado é o **MySQL**, acessado por meio do Sequelize ORM.
- O sistema pode ser expandido para autenticação de usuários, controle de permissões e geração de relatórios avançados.

---

<div align="center">

## ⭐ Gostou do projeto?

Se este projeto foi útil para você, considere deixar uma **⭐ no repositório**.

Isso ajuda a divulgar o projeto e incentiva seu desenvolvimento.

---

**Desenvolvido com ❤️, ☕ e muito JavaScript.**

### © 2025 — Del Company | Eliel Bernardi

</div>
