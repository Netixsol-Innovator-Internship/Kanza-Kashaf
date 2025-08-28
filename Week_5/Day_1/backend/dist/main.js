"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app.module");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const origin = process.env.ORIGIN || 'http://localhost:3000';
    app.enableCors({
        origin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map