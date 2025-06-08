
# Guide to Set Up the UFC Ask Project

## 📑 Overview

**UFC Ask** is a web-based chatbot application developed with **Node.js**, **Express**, and **MySQL**. It integrates a **Python RAG (Retrieval-Augmented Generation) API** to provide AI-generated responses to questions related to the academic environment of the **University Federal do Ceará (UFC)**.

## 🔗 Important Links

- **Figma Prototype:** [View Prototype](https://www.figma.com/design/JR1sGGT0yuR0od9Qoc4ijf/UFC-ASK?node-id=29-19&t=Z1lHqHjalADbkhk8-1)
- **RAG API:** [GitHub Repository for RAG API](https://github.com/PipInstallGustavo/UFC-ASK)

## 🛠️ Environment Setup

### **1. Install Node.js**

Make sure you have **[Node.js](https://nodejs.org/pt)** installed on your machine. You can download the latest version for your operating system.

---

## ⚙️ Setup

### **1. Clone the Project Repository**

Clone the project to your local machine:

```bash
git clone https://github.com/Werbster-MT/chat-bot-ufc-ask.git
```

### **2. Switch to the Development Branch**

Once you have cloned the repository, switch to the `development` branch to work on the latest development version:

```bash
git checkout development
```

### **3. Create a New Branch for Your Feature**

To ensure good project organization, create a new branch from `development` for your specific feature or bug fix. More about branching can be found in the [branching guidelines](branching_guideline.md).

```bash
git checkout -b [your-branch-name]
```

### **4. Install Dependencies**

If this is your first time working with the project, you will need to install the project dependencies. Run the following command in your terminal:

```bash
npm install
```

### **5. Run the Application**

To run the application with automatic reloading, use `nodemon`. This will watch for file changes and restart the server:

```bash
nodemon index.js
```

If you prefer to run the application without automatic reloading, simply use:

```bash
node index.js
```

---

## 🧑‍💻 Development Guidelines

- Please follow the [branching guidelines](branching_guideline.md) when contributing to the project.
- Write clean and readable code, following **JavaScript/Node.js** best practices.
- For backend development, ensure proper error handling and validation for API endpoints.

---

## 🔧 Technologies Used

- **Node.js:** Server-side JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **MySQL:** Relational database management system.
- **Python (FastAPI):** Python-based framework for the RAG (Retrieval-Augmented Generation) API.
- **Nodemon:** Tool to automatically restart the server during development.
- **Git:** Version control.

---

### 📋 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
