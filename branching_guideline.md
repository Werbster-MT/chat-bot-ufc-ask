
# Branching Guidelines - Branch Naming Convention

This document defines the **naming conventions** for the branches of the **UFC Ask** project, ensuring organization and clarity in version management.

## 1. **Branch Naming Convention**

Each branch should follow the following naming structure:

```
<type>/<action>
```

### Explanation of components:

- **`<type>`**: Defines the type of the branch. Examples:
  - `feat`: New feature.
  - `bug`: Bug fix.
  - `arch`: Architecture implementation.
  - `chore`: Maintenance tasks and technical adjustments (e.g., dependency updates).
  - `docs`: Documentation.
  - `test`: Add tests.

- **`<action>`**: A brief description of what was done. Examples:
  - `add-login-page` for adding a login page.
  - `fix-crash-on-login` for fixing a crash issue on login.

---

## 2. **Examples of Branches**

| Type  | Action              | Example of Naming Convention   |
|-------|---------------------|--------------------------------|
| `feat` | add-login-page      | `feat/add-login-page`          |
| `bug`  | fix-login-error     | `bug/fix-login-error`          |
| `arch` | add-mvc-arch        | `arch/add-mvc-arch`            |
| `docs` | update-readme       | `docs/update-readme`|
| `chore`| update-dependencies | `chore/update-dependencies`|
| `test`| test-login-page | `test/test-login-page`|

---

## 3. **Branch Creation Workflow**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Werbster-MT/chat-bot-ufc-ask.git
   ```

2. **Switch to the `development` branch:**
   ```bash
   git checkout development
   ```

3. **Create a new branch following the naming convention:**
   Example for creating a new branch for a feature:
   ```bash
   git checkout -b feat/add-login-page
   ```

4. **Develop and commit in a clear and concise manner.**

5. **Once the task is completed, create a Pull Request (PR) to the `development` branch.**
