# 🐾 Pet Shop - Sistema de Agendamento de Banhos

![Badge em Desenvolvimento](https://img.shields.io/badge/Status-Completo-green)
![Node](https://img.shields.io/badge/Node.js-v18+-success)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## 📝 Descrição do Projeto
Sistema completo para agendamento de banhos em pet shop desenvolvido como atividade individual. Permite:
- Cadastro seguro de usuários
- Autenticação com JWT
- Agendamentos com fotos dos pets
- CRUD completo de agendamentos

## 🛠 Tecnologias Utilizadas
| Frontend          | Backend           | Banco de Dados  | Outros           |
|-------------------|-------------------|-----------------|------------------|
| HTML5            | Node.js          | MySQL          | JWT             |
| CSS3             | Express          |                | Bcrypt          |
| JavaScript       | Multer           |                | Dotenv          |

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18+)
- MySQL 8.0+
- Git (opcional)

### 📥 Instalação
1. Clone o repositório:
```bash
git clone https://github.com/eric-bittu/petshop_crud.git
```
2. Instale as dependencias
``` bash
npm install bcryptjs cors dotenv express jsonwebtoken multer mysql2 nodemon
```
3. Inicie o servidor
```bash
npx nodemon server.js
```

### Estrutura do projeto
backend/
├── public/           # Frontend estático
│   ├── js/           # Scripts JavaScript
│   ├── style.css          # Estilos
│   └── *.html        # Páginas
├── routes/           # Definição de rotas
├── uploads/          # Armazenamento de imagens
├── .env              # Variáveis de ambiente
├── server.js         # Ponto de entrada
└── package.json      # Dependências
