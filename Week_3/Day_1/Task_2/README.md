# Task Manager API

A simple **Task Manager API** built with Node.js and Express, storing data in memory (no database).  
It supports CRUD operations on tasks and includes Swagger API documentation.

---

## Features

- **GET /api/tasks** – Retrieve all tasks
- **GET /api/tasks/:id** – Retrieve a single task by ID
- **POST /api/tasks** – Create a new task
- **PUT /api/tasks/:id** – Update an existing task
- **DELETE /api/tasks/:id** – Delete a task
- **Validation** – Ensures correct data format (`title` as string, `completed` as boolean)
- **Error Handling Middleware**
- **Swagger API Documentation** at `/api-docs`

---

## Technologies Used

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for Node.js
- **Swagger UI** – API documentation
- **nodemon** – Auto server restart during development

---
## Run the project (development mode):
   ```bash
   npm run dev
   ```

## Server will run on:
   ```
   http://localhost:3000
   ```

## Swagger docs available at:
   ```
   http://localhost:3000/api-docs
   ```

---

## API Endpoints

### **Get all tasks**
**GET** `/api/tasks`  
Response:
```json
{
  "success": true,
  "data": [ { "id": 1, "title": "Learn Express", "completed": false },
            { "id": 2, "title": "Learn Swagger", "completed": true },
            { "id": 3, "title": "Learn Backend", "completed": false } ],
  "message": "Tasks retrieved successfully"
}
```

### **Get task by ID**
**GET** `/api/tasks/{id}`  
Response:
```json
{
  "success": true,
  "data": { "id": 1, "title": "Learn Express", "completed": false },
  "message": "Task retrieved successfully"
}
```

### **Create a task**
**POST** `/api/tasks`  
Request body:
```json
{
  "title": "Learn Node",
  "completed": false
}
```

### **Update a task**
**PUT** `/api/tasks/{id}`  
Request body:
```json
{
  "title": "Learn Node - Updated",
  "completed": true
}
```

### **Delete a task**
**DELETE** `/api/tasks/{id}`

---

## Validation Rules
- `title` → Required, must be a string
- `completed` → Required, must be boolean

If validation fails, the server returns:
```json
{
  "success": false,
  "message": "Invalid data format. Title must be string & completed must be boolean."
}
```

---

## Testing

You can test the API using:
- **Postman** – Create a collection and send requests
- **Swagger UI** – Visit `/api-docs` in browser and try endpoints

---
