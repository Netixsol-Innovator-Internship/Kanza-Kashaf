"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const frontendOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
    app.enableCors({
        origin: frontendOrigins,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization, Accept',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Ecom Auth Step1')
        .setDescription('Auth + OTP + Users & RBAC')
        .setVersion('1.0')
        .addTag('auth')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
    }, 'jwt')
        .build();
    const doc = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, doc);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    const port = parseInt(process.env.PORT || '5000', 10);
    await app.listen(port);
    common_1.Logger.log(`App listening on http://localhost:${port}`);
    common_1.Logger.log(`Swagger available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map