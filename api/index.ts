import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";
import path from "path";
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

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

app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.post('/api/calcular-frete', async (req, res) => {
  res.json([
    {
      Codigo: 'FIXO', 
      Valor: '14,90',
      PrazoEntrega: '7 a 12',
      Tipo: 'Econômico (Fixo)' 
    },
    {
      Codigo: 'EXPRESSO',
      Valor: '29,90',
      PrazoEntrega: '3 a 6',
      Tipo: 'Rápido (Sedex)'
    }
  ]);
});

app.post('/api/criar-pagamento', async (req, res) => {
  const { itens, frete } = req.body; 

  try {
    const preference = new Preference(client);

    const itemsMP = itens.map((item: any) => ({
      id: item.id,
      title: item.nome,
      quantity: item.quantidade,
      unit_price: Number(item.preco)
    }));

    if (frete && Number(frete) > 0) {
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
          success: process.env.SITE_URL ? `${process.env.SITE_URL}/sucesso` : "https://elatho.com.br/sucesso", 
          failure: process.env.SITE_URL || "https://elatho.com.br/",
          pending: process.env.SITE_URL || "https://elatho.com.br/"
        },
        auto_return: "approved",
        statement_descriptor: "ELATHO JOIAS"
      }
    });

    res.json({ link: response.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar preferência de pagamento" });
  }
});

const httpServer = createServer(app);

(async () => {
  await registerRoutes(httpServer, app);
})();

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
