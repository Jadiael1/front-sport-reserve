# Sport Reserve Frontend

Este é o frontend do sistema de reserva de esportes, desenvolvido em React e TypeScript. O projeto permite que usuários façam login, visualizem, reservem, editem e excluam reservas de campos esportivos.

## Estrutura do Projeto

- `src/components`: Contém os componentes do projeto.
- `src/routes`: Configurações de rotas do React Router.
- `src/contexts`: Contém os contextos do React para gerenciar o estado global.
- `src/assets`: Contém arquivos de estilo CSS.

## Pré-requisitos

- Node.js (versão 14.x ou superior)
- npm (versão 6.x ou superior) ou yarn (versão 1.x ou superior)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Jadiael1/front-sport-reserve.git
cd front-sport-reserve
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

## Executando o Projeto

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:5173](http://localhost:5173) para ver o aplicativo no navegador.

## Estrutura de Diretórios

```plaintext
src/
│
├── components/
│   ├── AccountActivationReminder/
│   ├── Alert/
│   ├── FieldDetails/
│   ├── ForgotPassword/
│   ├── Home/
│   ├── ReservationList/
│   ├── ResetPassword/
│   ├── SignIn/
│   ├── SignUp/
│   └── ...
│
├── contexts/
│   └── AuthContext.tsx
│
├── routes/
│   ├── IRoutes.ts
│   ├── routesAuth.ts
│   └── routesSite.ts
│
├── assets/
│   └── main.css
│
├── App.tsx
├── main.tsx
└── ...
```

## Componentes Principais

### SignInPage

Página de login que permite ao usuário autenticar-se no sistema.

### ForgotPasswordPage

Página onde o usuário pode solicitar um e-mail para redefinir a senha.

### ResetPasswordPage

Página onde o usuário pode redefinir sua senha usando o link recebido por e-mail.

### ReservationList

Página que lista todas as reservas do usuário com opções para editar e excluir.

### FieldDetails

Página que mostra detalhes do campo e permite ao usuário fazer uma reserva.

## Rotas

### `routesAuth.ts`

Define as rotas para autenticação, como login, registro, esqueci a senha e redefinição de senha.

### `routesSite.ts`

Define as rotas principais do site, como a página inicial e detalhes do campo.

## Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
