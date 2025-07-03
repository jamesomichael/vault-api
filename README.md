![Vault API](https://mexhjsdibsoshbepazwt.supabase.co/storage/v1/object/public/portfolio25//vault-api.png)

![Coverage](https://img.shields.io/codecov/c/github/jamesomichael/vault-api)
[![Docs](https://img.shields.io/badge/docs-openapi-blue.svg)](https://jamesomichael.github.io/vault-api/)

A RESTful API to handle authentication and item management for _[Vault](https://github.com/jamesomichael/vault)_.

## **Local Development**

### **Prerequisites**

-   Node.js (v20+ recommended)
-   npm
-   Docker (optional)

### **Getting Started**

1. Install the required dependencies:

```bash
npm install
```

2. Rename the `.env.local` file to `.env`.
3. Add your own JWT secret to `.env`.
4. Create an empty `db` directory at the root of the project.
5. Run the server:

```bash
npm run dev
```

> For Docker, simply use `docker-compose up`.

## **Features**

-   Cookie-based authentication with JWT
-   Master password hashing with Argon2id
-   Create, read, update, and delete vault items
-   Strict schema validation with Joi
-   OpenAPI 3.0 compliant API [documentation](https://jamesomichael.github.io/vault-api/)

## **Tech Stack**

-   **TypeScript**
-   **Node.js**
-   **Express**
-   **SQLite** _(via better-sqlite3)_
-   **Celebrate (Joi)**
-   **JWT**
-   **Argon2id**
-   **OpenAPI 3.0**
-   **Swagger UI**
-   **Docker**
