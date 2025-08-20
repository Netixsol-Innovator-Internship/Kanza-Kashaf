import express from "express"
import cors from "cors"
import taskRoutes from "./routes/tasks"
import { specs, swaggerUi } from "./config/swagger"

const app = express()
const PORT = 5000

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173",   // Vite dev server
  "http://localhost:5000",   // Next.js/React dev (if needed)
  "https://kanzaweek4day1frontendtask.vercel.app",  // Production frontend
]

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl or mobile apps)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true, // enable cookies / auth headers if needed
  })
)

// Middleware
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
