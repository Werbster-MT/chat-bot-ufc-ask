# Guide to Set Up the UFC Ask Project

## 📑 Overview

**UFC Ask** is a web-based chatbot application developed with **Node.js**, **Express**, and **MySQL**. It integrates a **Python RAG (Retrieval-Augmented Generation) API** to provide AI-generated responses to questions related to the academic environment of the **Universidade Federal do Ceará (UFC)**.

## 🔗 Important Links

- **Figma Prototype:** [View Prototype](https://www.figma.com/design/JR1sGGT0yuR0od9Qoc4ijf/UFC-ASK?node-id=29-19&t=Z1lHqHjalADbkhk8-1)
- **RAG API:** [GitHub Repository for RAG API](https://github.com/PipInstallGustavo/UFC-ASK)

---

## ⚙️ Setup Instructions

### ✅ Step-by-Step

1. **Clone the project:**
   ```bash
   git clone https://github.com/Werbster-MT/chat-bot-ufc-ask.git
   cd chat-bot-ufc-ask
   ```

2. **Switch to the development branch:**
   ```bash
   git checkout development
   ```

3. **Create your own feature branch:**
   ```bash
   git checkout -b [your-feature-name]
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Create the database manually:**

   ```sql
   CREATE DATABASE ufc_ask;
   ```

6. **Run migrations:**
   ```bash
   npx sequelize-cli db:migrate
   ```

7. **Seed an admin user (email: admin@ufc.br | senha: admin123):**
   ```bash
   npx sequelize-cli db:seed:all
   ```

8. **Start the server:**
   ```bash
   npm run dev
   ```

9. **Visit:**
   ```
   http://localhost:3000
   ```

---

## 🔐 Authentication & Authorization

- Login credentials are verified using `bcrypt` and a **JWT** is generated on success.
- The token is stored in the session and used to authenticate future requests to the **API RAG**.
- Role-based access control is enforced using the `role` claim in the token (`admin` or `student`).
- Middleware can be applied to protect routes accordingly.

Example of token usage when calling the RAG API:

```js
const response = await axios.post('http://rag-api/ask', {
  question: 'Como fazer matrícula?'
}, {
  headers: {
    Authorization: `Bearer ${req.session.token}`
  }
});
```

---

## 🧑‍💻 Development Guidelines

- Follow the [branching guidelines](branching_guideline.md)
- Write clean, modular code
- Use `try/catch` around all async operations
- Do not commit secrets or `.env` files

---

## 📁 Technologies

- **Node.js**, **Express.js**
- **Sequelize** ORM + **MySQL**
- **JWT** for auth
- **FastAPI** (Python) for external RAG API
- **EJS** for views
- **Nodemon**, **bcrypt**

---

## 📝 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.