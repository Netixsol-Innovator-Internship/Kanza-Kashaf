import express from "express"
import cors from "cors"
import taskRoutes from "./routes/tasks"
import { specs, swaggerUi } from "./config/swagger"

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// Routes
app.use("/api/tasks", taskRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`)
})
