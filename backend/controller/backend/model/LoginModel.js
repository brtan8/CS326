import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const User = sequelize.define("Users", {
  uid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
});

class _SQLiteUserModel {
  constructor() {}

  async init(fresh = false) {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    if (fresh) {
      //await this.delete();

      await this.create({
        uid: "1",
        username: "test",
        password: "pass",
      });

      await this.create({
        uid: "2",
        username: "a",
        password: "b",
      });
    }
  }

  async create(user) {
    return await User.create(user);
  }

  async read(id = null) {
    if (id) {
      return await User.findByPk(id);
    }
    return await User.findAll();
  }

  async delete(user) {
    console.log(user.uid);
    await User.destroy({ where: { uid: user.uid } });
    return user;
  }
  async patch(uid, newPassword) {
    try {
      const user = await User.findOne({ where: { uid } });

      if (!user) {
        throw new Error("User not found");
      }

      // Update the password
      user.password = newPassword;

      // Save the updated user
      await user.save();

      return user; // Return the updated user
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

const SQLiteUserModel = new _SQLiteUserModel();

export default SQLiteUserModel;