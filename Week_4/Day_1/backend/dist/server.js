"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
// ✅ CORS configuration (allow all for production stability)
const corsOptions = {
    origin: "*", // allow all origins to prevent Vercel CORS issues
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
};
app.use((0, cors_1.default)(corsOptions));
// Handle pre-flight OPTIONS for all routes
app.options("*", (0, cors_1.default)(corsOptions));
// Middleware
app.use(express_1.default.json());
app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Task API Docs",
}));
// Routes
app.use("/api/tasks", tasks_1.default);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
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
    });
});
// ✅ Local dev server only
if (process.env.NODE_ENV !== "production") {
    const PORT = 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
}
// ✅ Export for Vercel
exports.default = app;
//# sourceMappingURL=server.js.map