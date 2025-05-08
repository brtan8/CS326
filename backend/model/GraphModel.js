import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", 
});

const Graph = sequelize.define("Graph", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

class _SQLiteGraphModel {
  async init(fresh = false) {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    if (fresh) {
        //await this.delete();
    
        await this.create({
            userId: "1",
            url: "https://example.com/graph1",
            type: "line",
            fileName: "graph1.png",
        });
    
        await this.create({
            userId: "2",
            url: "https://example.com/graph2",
            type: "bar",
            fileName: "graph2.png",
        });
    }
  }

  async create(graphData) {
    return await Graph.create(graphData);
  }

  async read(where = {}) {
    return await Graph.findAll({ where });
  }

  async delete(where) {
    return await Graph.destroy({ where });
  }
}

const SQLiteGraphModel = new _SQLiteGraphModel();
export default SQLiteGraphModel;