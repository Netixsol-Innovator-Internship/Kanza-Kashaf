import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "A simple task management API with CRUD operations",
    },
    servers: [
      {
        url: "https:kanzaweek4day1backendtask.vercel.app",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          required: ["id", "title", "completed", "createdAt", "updatedAt"],
          properties: {
            id: {
              type: "string",
              description: "The unique identifier for the task",
              example: "1",
            },
            title: {
              type: "string",
              description: "The task title",
              example: "Complete project documentation",
            },
            completed: {
              type: "boolean",
              description: "Whether the task is completed",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "When the task was created",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "When the task was last updated",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              description: "The task title",
              example: "Complete project documentation",
              minLength: 1,
            },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The updated task title",
              example: "Complete project documentation",
              minLength: 1,
            },
            completed: {
              type: "boolean",
              description: "Whether the task is completed",
              example: true,
            },
          },
        },
        TaskStats: {
          type: "object",
          properties: {
            total: {
              type: "number",
              description: "Total number of tasks",
              example: 10,
            },
            completed: {
              type: "number",
              description: "Number of completed tasks",
              example: 3,
            },
            pending: {
              type: "number",
              description: "Number of pending tasks",
              example: 7,
            },
          },
        },
        TasksResponse: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
            },
            stats: {
              $ref: "#/components/schemas/TaskStats",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
              example: "Task not found",
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
}

const specs = swaggerJsdoc(options)

export { specs, swaggerUi }
