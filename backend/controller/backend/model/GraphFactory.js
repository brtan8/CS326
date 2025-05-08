import SQLiteGraphModel from "./GraphModel.js";

class _ModelFactory {
  async getModel(model = "sqlite") {
    if (model === "sqlite") {
      return SQLiteGraphModel;
    } else if (model === "sqlite-fresh") {
      await SQLiteGraphModel.init(true);
      return SQLiteGraphModel;
    } 
  }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;