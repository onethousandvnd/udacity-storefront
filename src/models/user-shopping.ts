import bcrypt from "bcrypt";
import client from "../database";

export interface UserShoppingModel {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
}

export class UserShopping {
  async getAll(): Promise<UserShoppingModel[]> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM usershopping";
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (err) {
      throw new Error(`System error! Cannot get users.`);
    }
  }

  async create(user: CreateUserDto): Promise<UserShoppingModel> {
    const { firstName, lastName, username, password } = user;
    const connection = await client.connect();
    try {
      const checkUserSql = "SELECT * FROM usershopping WHERE username=$1";
      let checkResult = await connection.query<UserShoppingModel>(
        checkUserSql,
        [username]
      );

      if (checkResult.rowCount > 0) {
        throw new Error(`Username is already exist!`);
      }

      const sql =
        "INSERT INTO usershopping (firstName, lastName, username, password) VALUES($1, $2, $3, $4) RETURNING *";
      const hash = bcrypt.hashSync(
        password + process.env.BCRYPT_PASSWORD,
        parseInt(process.env.SALT as string, 10)
      );
      var result = await connection.query<UserShoppingModel>(sql, [
        firstName,
        lastName,
        username,
        hash,
      ]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`System error! Cannot create user.`);
    } finally {
      connection.release();
    }
  }

  async update(
    id: number,
    updateUserInput: UpdateUserDto
  ): Promise<UserShoppingModel> {
    const connection = await client.connect();
    try {
      const checkUserSql = "SELECT * FROM usershopping WHERE id=$1";
      let checkResult = await connection.query<UserShoppingModel>(
        checkUserSql,
        [id]
      );

      if (checkResult.rowCount == 0) {
        throw new Error(`User does not exist!`);
      }

      const sql =
        "UPDATE usershopping SET firstName=$1, lastName=$2 WHERE id=$3 RETURNING *";
      const result = await connection.query(sql, [
        updateUserInput.firstName,
        updateUserInput.lastName,
        id,
      ]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`System error! Cannot update user.`);
    } finally {
      connection.release();
    }
  }

  async getById(id: number): Promise<UserShoppingModel> {
    const connection = await client.connect();
    try {
      const sql = "SELECT * FROM usershopping WHERE id=$1";
      const result = await connection.query<UserShoppingModel>(sql, [id]);

      if (result.rowCount == 0) {
        throw new Error(`Error ! User not found.`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`System error!`);
    } finally {
      connection.release();
    }
  }

  async delete(id: number): Promise<boolean> {
    const connection = await client.connect();
    try {
      const sql = "DELETE FROM usershopping WHERE id=$1";
      await connection.query(sql, [id]);
      return true;
    } catch (err) {
      throw new Error(`Can not delete user.`);
    } finally {
      connection.release();
    }
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<UserShoppingModel | null> {
    const connection = await client.connect();
    try {
      const sql = "SELECT * FROM usershopping WHERE username=$1";
      const result = await connection.query<UserShoppingModel>(sql, [username]);
      if (result.rowCount > 0) {
        const user = result.rows[0];
        if (
          bcrypt.compareSync(
            password + process.env.BCRYPT_PASSWORD,
            user.password
          )
        ) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`System error !`);
    } finally {
      connection.release();
    }
  }
}
