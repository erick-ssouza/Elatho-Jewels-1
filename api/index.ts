import express, { Express } from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../server/routes';

// Cache da instância do app para evitar Cold Start lento
let app: Express;

const bootstrap = async () => {
  const application = express();

  // Aumenta limite do body para evitar erro em uploads grandes
  application.use(express.json({ limit: '10mb' }));
  application.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cria o servidor HTTP
  const server = createServer(application);

  // Carrega suas rotas originais (incluindo upload)
  await registerRoutes(server, application);

  return application;
};

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await bootstrap();
  }

  // O truque do Express na Vercel:
  // Passa a requisição para o app processar
  return app(req, res);
}