# Front Sport Reserve

Este é o front-end do sistema Sport Reserve, uma aplicação para gerenciamento de reservas de quadras esportivas. O front-end é construído utilizando **React**, **TypeScript** e **Vite** e se comunica com a API do back-end Sport Reserve.

## Demo

Você pode testar o sistema em:
- URL da aplicação: [https://sport-reserve.juvhost.com](https://sport-reserve.juvhost.com)

## Tecnologias Utilizadas

- **React 18**: Framework principal para construção da interface.
- **TypeScript 5.2.2**: Tipagem estática para melhor manutenção do código.
- **Vite 5.3.1**: Ferramenta de build rápida e moderna.
- **TailwindCSS 3.4.4**: Framework para estilização rápida e responsiva.
- **React Router Dom 6.24.0**: Gerenciamento de rotas.
- **React Icons**: Ícones integrados.
- **Leaflet e React-Leaflet**: Integração com mapas.
- **Chart.js e React-Chartjs-2**: Criação de gráficos.
- **JSX e TSX**: Suporte para componentes.

---

## Funcionalidades

- **Autenticação**
  - Login, registro e recuperação de senha.
  - Proteção de rotas com autenticação JWT.
  - Integração com reCAPTCHA V2 e V3.

- **Gerenciamento de Reservas**
  - Visualização de quadras disponíveis.
  - Reservas com horários definidos.
  - Impressão de relatórios detalhados de reservas.

- **Painel Administrativo**
  - Criação e atualização de campos esportivos.
  - Gerenciamento de usuários e permissões.
  - Visualização e exportação de relatórios.

- **Gráficos e Relatórios**
  - Gráficos detalhados de desempenho.
  - Relatórios financeiros e de ocupação.
  - Exportação de dados para PDF e Excel.

---

## Estrutura de Diretórios

```txt
Estrutura de diretórios:
└── front-sport-reserve/
    ├── README.md
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── .editorconfig
    ├── .env.example
    ├── .eslintignore
    ├── .eslintrc.json
    ├── .prettierignore
    ├── .prettierrc
    ├── public/
    │   └── .htaccess
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── vite-env.d.ts
    │   ├── assets/
    │   │   ├── main.css
    │   │   ├── img/
    │   │   └── svg/
    │   │       └── AnimateSpin.tsx
    │   ├── components/
    │   │   └── common/
    │   │       ├── Alert/
    │   │       │   └── index.tsx
    │   │       ├── Carousel/
    │   │       │   ├── index.tsx
    │   │       │   └── assets/
    │   │       │       └── main.css
    │   │       ├── ConfirmationModalProps/
    │   │       │   └── index.tsx
    │   │       ├── DatePicker/
    │   │       │   └── index.tsx
    │   │       ├── Footer/
    │   │       │   └── index.tsx
    │   │       ├── GoBack/
    │   │       │   └── index.tsx
    │   │       ├── LogoutButton/
    │   │       │   └── index.tsx
    │   │       ├── Message/
    │   │       │   ├── MessageManager.tsx
    │   │       │   ├── index.tsx
    │   │       │   └── messageInstance.tsx
    │   │       ├── Modal/
    │   │       │   └── index.tsx
    │   │       ├── NavBar/
    │   │       │   ├── DropdownArrow.tsx
    │   │       │   ├── IconButton.tsx
    │   │       │   ├── LoginButton.tsx
    │   │       │   ├── LoginButtonWithIcon.tsx
    │   │       │   ├── Logo.tsx
    │   │       │   ├── MobileControlButtons.tsx
    │   │       │   ├── MobileUserDropdown.tsx
    │   │       │   ├── NavBar.tsx
    │   │       │   ├── NavItem.tsx
    │   │       │   ├── NavigationMenu.tsx
    │   │       │   ├── UserAvatar.tsx
    │   │       │   ├── UserDropdown.tsx
    │   │       │   └── UserDropdownSkeleton.tsx
    │   │       └── Sidebar/
    │   │           └── index.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── hooks/
    │   │   └── useAuth.ts
    │   ├── interfaces/
    │   │   ├── IApiFieldResponse.ts
    │   │   ├── IApiReservationResponse.ts
    │   │   ├── IApiResponse.ts
    │   │   ├── IDaysOfTheWeek.ts
    │   │   ├── IField.ts
    │   │   ├── IFieldAvailability.ts
    │   │   ├── IImage.ts
    │   │   ├── IPaginatedData.ts
    │   │   ├── IPaginationLink.ts
    │   │   ├── IPayments.ts
    │   │   ├── IReport.ts
    │   │   ├── IReservation.ts
    │   │   └── IUser.ts
    │   ├── pages/
    │   │   ├── Dashboard/
    │   │   │   ├── FieldAvailabilities/
    │   │   │   │   └── index.tsx
    │   │   │   ├── Home/
    │   │   │   │   └── index.tsx
    │   │   │   ├── Payments/
    │   │   │   │   └── index.tsx
    │   │   │   ├── PrintReservations/
    │   │   │   │   └── index.tsx
    │   │   │   ├── Reports/
    │   │   │   │   └── index.tsx
    │   │   │   └── Users/
    │   │   │       └── index.tsx
    │   │   ├── FieldDetails/
    │   │   │   └── index.tsx
    │   │   ├── FieldStore/
    │   │   │   └── index.tsx
    │   │   ├── FieldUpdate/
    │   │   │   └── index.tsx
    │   │   ├── Home/
    │   │   │   └── index.tsx
    │   │   ├── Profile/
    │   │   │   ├── EditInputField.tsx
    │   │   │   ├── InfoItem.tsx
    │   │   │   └── index.tsx
    │   │   ├── ReservationList/
    │   │   │   └── index.tsx
    │   │   └── auth/
    │   │       ├── AccountActivationReminder/
    │   │       │   └── index.tsx
    │   │       ├── EmailVerification/
    │   │       │   └── index.tsx
    │   │       ├── ForgotPassword/
    │   │       │   └── index.tsx
    │   │       ├── ResetPassword/
    │   │       │   └── index.tsx
    │   │       ├── SignIn/
    │   │       │   └── index.tsx
    │   │       └── SignUp/
    │   │           └── index.tsx
    │   ├── routes/
    │   │   ├── IRoutes.ts
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── index.tsx
    │   │   ├── routes.ts
    │   │   ├── routesAuth.ts
    │   │   ├── routesDash.ts
    │   │   └── routesSite.ts
    │   └── utils/
    │       ├── capitalize.ts
    │       ├── errorHandler.ts
    │       ├── formatCPF.ts
    │       ├── formatPhone.ts
    │       ├── formateDate.ts
    │       ├── goBack.ts
    │       ├── isEmptyObject.ts
    │       ├── translate.ts
    │       ├── translateDaysOfTheWeek.ts
    │       └── translations.json
    └── .github/
        └── workflows/
            └── deploy.yml
```

---

## Requisitos do Sistema

- **Node.js 18+**
- **NPM ou Yarn**: Para gerenciar dependências.
- **Vite**: Para rodar o ambiente de desenvolvimento.

---

## Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/Jadiael1/front-sport-reserve.git
   cd front-sport-reserve
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o ambiente:
   ```bash
   cp .env.example .env
   ```
   Atualize o `.env` com as variáveis de ambiente adequadas, como `VITE_API_BASE_URL`.

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## Testes

O projeto utiliza `ESLint` e `Prettier` para garantir qualidade de código e consistência de estilo.

Execute o linting:
```bash
npm run lint
```

---

## Licença

Este projeto é protegido por uma **Licença Proprietária**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
