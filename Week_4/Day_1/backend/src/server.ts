import express from "express"
import cors from "cors"
import path from "path"
import taskRoutes from "./routes/tasks"
import { specs, swaggerUi } from "./config/swagger"

const app = express()

// ✅ CORS configuration (allow all for production stability)
const corsOptions: cors.CorsOptions = {
  origin: "*", // allow all origins to prevent Vercel CORS issues
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
}
app.use(cors(corsOptions))

// Handle pre-flight OPTIONS for all routes
app.options("*", cors(corsOptions))

// Middleware
app.use(express.json())

// ✅ Swagger UI assets explicitly served (fixes 404 on Vercel)
const swaggerUiDist = path.join(__dirname, "../node_modules/swagger-ui-dist")
app.use("/swagger-ui", express.static(swaggerUiDist))

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Task API Docs",
    swaggerUrl: "/swagger-ui/swagger-ui-bundle.js",
  })
)

// Routes
app.use("/api/tasks", taskRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      tasks: "/api/tasks",
      docs: "/api-docs",
      health: "/health",
    },
  })
})

// ✅ Local dev server only
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`)
  })
}

// ✅ Export for Vercel
export default app
