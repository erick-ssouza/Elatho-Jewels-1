import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import path from "path";
// IMPORTAÇÕES NOVAS
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { calcularPrecoPrazo } from 'correios-brasil';

const app = express();
const httpServer = createServer(app);

// CONFIGURAÇÃO DO MERCADO PAGO
// ⚠️ TROQUE PELA SUA ACCESS TOKEN (Do Mercado Pago / Seu Negócio / Credenciais)
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-8323393532710222-121813-fd32d80bbabee577c164a00def0672ab-316502627' });

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

// ========================================
// 📤 SERVIR ARQUIVOS DE UPLOAD
// ========================================
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  
  // ========================================
  // 🚚 ROTA DE CÁLCULO DE FRETE (CORREIOS)
  // ========================================
  app.post('/api/calcular-frete', async (req, res) => {
    const { cepDestino } = req.body;
    
    if (!cepDestino) {
      return res.status(400).json({ message: "CEP de destino é obrigatório" });
    }

    // Configuração do pacote (300g, caixa pequena)
    // CEP Origem: Rio Claro (Generico: 13500-000 ou coloque o seu específico da rua)
    const args = {
      sCepOrigem: '13500000', 
      sCepDestino: cepDestino.replace(/\D/g, ''), // Remove traços e pontos
      nVlPeso: '0.3',
      nCdFormato: '1', 
      nVlComprimento: '16',
      nVlAltura: '4',
      nVlLargura: '11',
      nCdServico: ['04014', '04510'], // Sedex e PAC
      nVlDiametro: '0',
    };

    try {
      const response = await calcularPrecoPrazo(args);
      res.json(response);
    } catch (error) {
      console.error("Erro Correios:", error);
      res.status(500).json({ message: "Erro ao calcular frete" });
    }
  });

  // ========================================
  // 💳 ROTA DE PAGAMENTO (MERCADO PAGO)
  // ========================================
  app.post('/api/criar-pagamento', async (req, res) => {
    const { itens, frete } = req.body; // O frontend deve mandar os itens e valor do frete

    try {
      const preference = new Preference(client);
      
      // Monta a lista de produtos para o MP
      const itemsMP = itens.map((item: any) => ({
        id: item.id,
        title: item.nome,
        quantity: item.quantidade,
        unit_price: Number(item.preco)
      }));

      // Adiciona o frete como um item de "Envio" se houver valor
      if (frete && frete > 0) {
        itemsMP.push({
          id: 'frete',
          title: 'Frete - Envio',
          quantity: 1,
          unit_price: Number(frete)
        });
      }

      const response = await preference.create({
        body: {
          items: itemsMP,
          back_urls: {
            success: "https://elatho.com.br/sucesso", // Troque pelo seu domínio quando tiver
            failure: "https://elatho.com.br/",
            pending: "https://elatho.com.br/"
          },
          auto_return: "approved",
        }
      });

      res.json({ link: response.init_point });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar preferência de pagamento" });
    }
  });

  // Registra as rotas originais (banco de dados, produtos, etc)
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  
  // Tratamento de erro para porta ocupada
  httpServer.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.error('⚠️ ATENÇÃO: A porta 5000 está ocupada!');
      console.error('👉 Vá no Shell e digite: kill -9 $(lsof -t -i:5000)');
      process.exit(1);
    }
  });

  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
