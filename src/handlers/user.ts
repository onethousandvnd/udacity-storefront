import { Application, Request, Response } from 'express';
import { verifyAuthToken, getTokenByUser } from '../ultility/authen-authorize';
import { UserShopping, UserShoppingModel } from '../models/user-shopping';

const userModel = new UserShopping();

const getAll = async (req: Request, res: Response) => {
  try {
    const users: UserShoppingModel[] = await userModel.getAll();

    res.json(users);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const password = req.body.password;

    if (!firstName || !lastName || !username || !password) {
      res.status(400);
      res.send(
        'Bad request!'
      );
      return false;
    }
    const user = await userModel.create({
      firstName,
      lastName,
      username,
      password,
    });

    res.json({
      ...user,
      token: getTokenByUser(user)
    });
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if (!id || !firstName || !lastName) {
      res.status(400);
      res.send(
        'Bad request!'
      );
      return false;
    }
    const user = await userModel.update(id, {
      firstName,
      lastName
    });

    res.json({
      ...user,
      token: getTokenByUser(user)
    });
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
    const user = await userModel.getById(id);
    
    res.json(user);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400);
      res.send('Bad request!');
      return false;
    }
    await userModel.delete(id);
    
    res.send(`Delete user success!`);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const username = req.body.username as unknown as string;
    const password = req.body.password as unknown as string;
    if (!username || !password) {
      res.status(400);
      res.send(
        'Please provide a valid input for param eg. :username, :password'
      );
      return false;
    }
    const user = await userModel.authenticate(username, password);
    if (!user) {
      res.status(401)
      res.send(`Error! Invalid username or password!`);
      return false;
    }
    res.json(getTokenByUser(user));
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export default function userRoutes(app: Application) {
  app.get('/users',verifyAuthToken, getAll);
  app.post('/user',verifyAuthToken, create);
  app.get('/user/:id',verifyAuthToken, getById);
  app.put('/user/:id', verifyAuthToken, update);
  app.delete('/user/:id', verifyAuthToken, deleteUser);
  app.get('/user/authenticate', authenticate);
}
