# 🔐 Fullstack Auth App com React 19, Vite 7, TailwindCSS 4, Node.js, Express 5, MongoDB e JWT

Aplicação web fullstack moderna com autenticação segura via JWT, comunicação entre cliente e servidor com cookies HTTP-only e integração com MongoDB para persistência de dados. A interface é construída com React e estilizada com TailwindCSS, oferecendo navegação SPA com React Router DOM.

---

## 🚀 Funcionalidades

- ✅ Registro e login de usuários com verificação de email via OTP
- ✅ Autenticação com JWT armazenado em cookies seguros
- ✅ Rotas privadas no frontend e backend
- ✅ Integração com MongoDB via Mongoose
- ✅ Envio de e-mails com OTP usando Nodemailer
- ✅ Estilização com TailwindCSS
- ✅ Toasts para feedback de ações (com React Toastify)

---

## 🧰 Tecnologias Utilizadas

### Frontend (/client)
- React 19
- Vite 7
- Tailwind CSS 4
- React Router DOM 7
- Axios
- React Toastify
- ESLint + Plugins

### Backend (/server)
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- BcryptJS
- Cookie Parser
- Dotenv
- Nodemailer

---

## 🔐 Autenticação com JWT

- Após login, o backend gera um token JWT assinado com JWT_SECRET
- O token é armazenado como cookie HTTP-only
- Middleware verifica o token em rotas protegidas
- O frontend envia o cookie automaticamente nas requisições

---

## 📦 Instalação e Execução

### 1. Clone o repositório

bash
git clone https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP.git
cd MERN---JWT-Auth-com-OTP


### 2. Backend (/server)
bash
cd server
npm install

Crie um arquivo .env com o seguinte conteúdo:
env
PORT=5000
MONGO_URI=mongodb+srv://utilizador:senha@cluster.mongodb.net/nomedobanco
JWT_SECRET=sua_chave_jwt
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_aplicacao

Execute o servidor:
bash
npm run server
ou
npm start


### 3. Frontend (/client)
bash
cd client
npm install

Crie um arquivo .env com o seguinte conteúdo:
env
VITE_BACKEND_URL=dominio_do_backend

Execute o forntend:
bash
npm run dev


---


## 🧪 Pré-requisitos

- Node.js v18+
- MongoDB Atlas ou local
- Conta de e-mail com senha de app (Gmail recomendado)

---

## 📸 Imagens Demo

![image alt](https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP/blob/7ff9a4df6320855612c8ae951027959d1192d5b0/demo_Images/HomePage.png)
![image alt](https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP/blob/7ff9a4df6320855612c8ae951027959d1192d5b0/demo_Images/LoginPage.png)
![image alt](https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP/blob/7ff9a4df6320855612c8ae951027959d1192d5b0/demo_Images/CreateAccountPage.png)
![image alt](https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP/blob/7ff9a4df6320855612c8ae951027959d1192d5b0/demo_Images/ResetPasswordPage.png)
![image alt](https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP/blob/7ff9a4df6320855612c8ae951027959d1192d5b0/demo_Images/ResetPasswordOTPPage.png)
![image alt](https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP/blob/7ff9a4df6320855612c8ae951027959d1192d5b0/demo_Images/NewPasswordPage.png)
![image alt](https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP/blob/7ff9a4df6320855612c8ae951027959d1192d5b0/demo_Images/EmailVerifyOTPPage.png)
![image alt](https://github.com/HugoSpecial/MERN---JWT-Auth-com-OTP/blob/7ff9a4df6320855612c8ae951027959d1192d5b0/demo_Images/HomePageLogin.png)

---


## 📄 Licença
Este projeto é apenas para fins de aprendizado.

---

## 👤 Autor

 - [Hugo Especial](https://github.com/HugoSpecial)
