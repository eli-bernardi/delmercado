Aqui está um **README.md** completo e profissional para o seu sistema **Del Mercado**:

---

## 📄 `README.md`

```markdown
# 🛒 Del Mercado - Sistema de Compras Interno

Sistema web full-stack para gerenciamento de compras, estoque, usuários, produtos e relatórios analíticos. Desenvolvido como protótipo piloto para uma rede varejista, com arquitetura REST e integração com banco de dados MySQL.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Endpoints da API](#endpoints-da-api)
- [Funcionalidades](#funcionalidades)
- [Telas do Sistema](#telas-do-sistema)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 🚀 Sobre o Projeto

O **Del Mercado** é um sistema de compras interno desenvolvido para unificar operações de estoque, vendas e relatórios analíticos. O projeto foi criado como um protótipo piloto para validar a arquitetura de software proposta, garantindo o fluxo contínuo e íntegro dos dados.

### Principais Objetivos

- ✅ Integração com catálogos externos (DummyJSON) para carga inicial de produtos e usuários
- ✅ Gestão transacional de usuários, produtos e movimentações de estoque
- ✅ Consolidação de relatórios analíticos e gráficos para tomada de decisões gerenciais
- ✅ Arquitetura REST full-stack com Node.js e MySQL

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Ambiente de execução JavaScript |
| **Express.js** | Framework para construção da API REST |
| **Sequelize** | ORM para mapeamento objeto-relacional |
| **MySQL** | Banco de dados relacional |
| **CORS** | Middleware para requisições cross-origin |

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização e animações (Glassmorphism) |
| **JavaScript (Vanilla)** | Interações e consumo da API |
| **Chart.js** | Geração de gráficos analíticos |

### Ferramentas
| Tecnologia | Descrição |
|------------|-----------|
| **Nodemon** | Recarga automática do servidor durante desenvolvimento |
| **REST Client** | Testes de API via VS Code |
| **Git/GitHub** | Versionamento de código |

---

## 📁 Estrutura do Projeto

```
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

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [MySQL](https://www.mysql.com/) (versão 8 ou superior)
- [Git](https://git-scm.com/) (para clonar o repositório)
- [VS Code](https://code.visualstudio.com/) (recomendado) com extensão **REST Client**

---

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/eli-bernardi/del-mercado.git
cd del-mercado
```

### 2. Configure o banco de dados

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE db_compras;
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=seu_password
DB_NAME=db_compras
```

### 5. Execute as migrations (criação das tabelas e views)

O servidor criará automaticamente as tabelas e views ao iniciar.

### 6. Inicie o servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

### 7. Acesse o frontend

Abra o arquivo `frontend/html/index.html` no navegador ou sirva via Live Server.

---

## 🔗 Endpoints da API

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/usuarios` | Lista todos os usuários |
| GET | `/usuarios/:id` | Busca usuário por ID |
| POST | `/usuarios` | Cadastra novo usuário |
| PUT | `/usuarios/:id` | Atualiza usuário |
| DELETE | `/usuarios/:id` | Exclui usuário |
| POST | `/usuarios/bulk` | Carga em lote via DummyJSON |

### Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca produto por ID |
| POST | `/produtos` | Cadastra novo produto |
| PUT | `/produtos/:id` | Atualiza produto |
| DELETE | `/produtos/:id` | Exclui produto |
| POST | `/produtos/bulk` | Carga em lote via DummyJSON |

### Compras / Movimentações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/compras` | Lista todas as movimentações |
| POST | `/compras` | Registra nova movimentação (entrada/saída) |

### Relatórios

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/compras/relatorios/produtos-criticos` | Produtos com estoque < 10 |
| GET | `/compras/relatorios/volume-compras` | Volume financeiro por produto |
| GET | `/compras/relatorios/graficos` | Dados para gráficos |

---

## 🎯 Funcionalidades

### Usuários (CRUD)
- ✅ Cadastrar usuário
- ✅ Listar usuários
- ✅ Buscar por ID ou nome
- ✅ Atualizar dados
- ✅ Excluir usuário
- ✅ Carga em lote via DummyJSON

### Produtos (CRUD)
- ✅ Cadastrar produto
- ✅ Listar produtos
- ✅ Buscar por ID ou nome
- ✅ Atualizar dados
- ✅ Excluir produto
- ✅ Carga em lote via DummyJSON

### Movimentações
- ✅ Registrar entrada de produtos
- ✅ Registrar saída de produtos (com validação de estoque)
- ✅ Listar histórico completo

### Relatórios
- ✅ Produtos críticos (estoque < 10)
- ✅ Volume financeiro movimentado por produto

### Gráficos (Chart.js)
- ✅ Estoque físico atual (barras verticais)
- ✅ Volume financeiro de compras (barras horizontais - Top 5)

### Dashboard
- ✅ Cards com informações de produtos
- ✅ Busca em tempo real
- ✅ Importação de dados via DummyJSON

---

## 🖥️ Telas do Sistema

| Tela | Descrição |
|------|-----------|
| **Dashboard** | Visão geral com cards de produtos e botões de importação |
| **Usuários** | CRUD completo com tabela e formulário |
| **Produtos** | CRUD completo com tabela e formulário |
| **Movimentações** | Registro de entrada/saída de produtos |
| **Relatórios** | Exibição de relatórios estratégicos |
| **Gráficos** | Visualização analítica com Chart.js |

---

## 🧪 Testes

### Testes com REST Client (VS Code)

O projeto inclui um arquivo `teste.http` na raiz com testes para todos os endpoints. Para executar:

1. Instale a extensão **REST Client** no VS Code
2. Abra o arquivo `teste.http`
3. Clique em "Send Request" em cada bloco de teste

### Exemplo de teste

```http
### Listar todos os usuários
GET http://localhost:3000/usuarios

### Cadastrar novo usuário
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

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

**Desenvolvedor:** Eliel Bernardi  
**Email:** elielbernardi0012@gmail.com  
**GitHub:** [eli-bernardi](https://github.com/eli-bernardi)  
**Instagram:** [@elielbrnrd](https://www.instagram.com/elielbrnrd/)  
**Whatsapp:** (48) 99101-3184

---

**Desenvolvido com 💻 e ☕ por Eliel Bernardi - Del Company © 2025**
```

---

## 📌 Como usar

1. Crie um arquivo chamado `README.md` na raiz do seu projeto.
2. Cole todo o conteúdo acima.
3. Ajuste as informações conforme necessário (ex: seu nome, email, links).

Se precisar de alterações ou adicionar mais detalhes, é só me avisar! 😊
