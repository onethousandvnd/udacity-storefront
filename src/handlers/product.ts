import { Application, Request, Response } from 'express';
import { verifyAuthToken } from './../ultility/authen-authorize';
import { Product, ProductModel } from '../models/product';

const productModel = new Product();

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.getAll();
    res.json({products: products});
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const price = req.body.price as unknown as number;

    if (!name || !price) {
      res.status(400);
      res.send('Bad request!');
      return false;
    }
    const product = await productModel.create({ name, price });
    res.json({
      product,
    });
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const name = req.body.name;
    const price = req.body.price as unknown as number;
    if (!id || !name || !price) {
      res.status(400);
      res.send('Bad request!');
      return false;
    }
    const product = await productModel.update(id, {
      name,
      price,
    });

    res.json(product);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Bad request!');
      return false;
    }
    const product = await productModel.getById(id);

    res.json(product);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400);
      res.send('Bad request!');
      return false;
    }
    await productModel.deleteProduct(id);
    res.send(`Delete product success!`);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export default function productRoutes(app: Application) {
  app.get('/product', getAllProducts);
  app.post('/product', verifyAuthToken, create);
  app.get('/product/:id', getById);
  app.put('/product/:id', verifyAuthToken, update);
  app.delete('/product/:id', verifyAuthToken, deleteProduct);
}
