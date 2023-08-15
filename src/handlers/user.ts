import { Application, Request, Response } from 'express';
import { verifyAuthToken, getTokenByUser } from '../ultility/authen-authorize';
import { UserShopping, UserShoppingModel } from '../models/user-shopping';

const userModel = new UserShopping();

const getAll = async (req: Request, res: Response) => {
  try {
    const users: UserShoppingModel[] = await userModel.getAll();

    res.json({users: users});
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const password = req.body.password;
    if (!firstname || !lastname || !username || !password) {
      res.status(400);
      res.send(
        'Bad request!'
      );
      return false;
    }
    const user = await userModel.create({
      firstname,
      lastname,
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
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    if (!id || !firstname || !lastname) {
      res.status(400);
      res.send(
        'Bad request!'
      );
      return false;
    }
    const user = await userModel.update(id, {
      firstname,
      lastname
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
        'Bad request!'
      );
      return false;
    }
    const user = await userModel.authenticate(username, password);
    if (!user) {
      res.status(401)
      res.send(`Error! Invalid username or password!`);
      return false;
    }
    res.json({token: getTokenByUser(user)});
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export default function userRoutes(app: Application) {
  app.get('/user',verifyAuthToken, getAll);
  app.post('/user', create);
  app.get('/user/:id',verifyAuthToken, getById);
  app.put('/user/:id', verifyAuthToken, update);
  app.delete('/user/:id', verifyAuthToken, deleteUser);
  app.post('/user/authenticate', authenticate);
}
