# Lista Pronta 📝

![Lista Pronta Banner](https://raw.githubusercontent.com/paulpessoa/lista-pronta/refs/heads/main/public/images/landingpage.png)

Um aplicativo web inovador para criar e compartilhar listas de compras de forma simples e intuitiva. Otimize seu tempo no supermercado mantendo suas compras organizadas e compartilhando-as facilmente com família, amigos e colegas.

## 🌟 Funcionalidades

- ✨ Criação de listas de compras personalizadas
- 🔄 Compartilhamento em tempo real
- 👥 Colaboração em grupo
- 📱 Interface responsiva
- 🔍 Busca rápida de produtos
- 📊 Organização por categorias
- 💰 Cálculo de valores totais
- 🎯 Marcação de itens comprados

## 🛠️ Tecnologias Utilizadas

- Frontend:
  - React.js
  - Next.js
  - Tailwind CSS
  - TypeScript
  - MaterialUI

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - Redis (cache)
  - TypeORM

## 📊 Estrutura do Banco de Dados

### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Lists
```sql
CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


## 🚀 Como Executar

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/lista-pronta.git
```

2. Instale as dependências
```bash
cd lista-pronta
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados
```bash
npm run migration:run
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 📱 Layout Responsivo

O aplicativo foi desenvolvido com foco em uma experiência consistente em diferentes dispositivos:

- Desktop (1920px)
- Tablet (1024px)
- Mobile (375px)

## 🔐 Segurança

- Autenticação JWT
- Criptografia de senhas com bcrypt
- Proteção contra XSS
- Rate limiting
- CORS configurado
- Validação de dados com Zod

## 📖 Documentação da API

A documentação completa da API está disponível em:
`http://localhost:3000/api-docs`

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Trabalho Inicial* - [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Equipe de design
- Contribuidores do projeto
- Comunidade open source

---
© 2024 Lista Pronta. Todos os direitos reservados.

## Project Structure

├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   └── theme-provider.tsx
│   ├── ui/
│   │   └── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── checkbox.tsx
│   │   └── dialog.tsx
│   │   └── input.tsx
│   │   └── label.tsx
│   └── shopping/
│   │   ├── create-list-form.tsx
│   │   ├── list-item.tsx
│   │   └── share-dialog.tsx
│   │   └── types.ts
├── lib/
│   └── supabase.ts
│   └── utils.ts
├── tailwind.config.js
└── next.config.js


