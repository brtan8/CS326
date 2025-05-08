import SQLiteUserModel from "./LoginModel.js";

class _ModelFactory {
  async getModel(model = "sqlite-fresh") {
    if (model === "sqlite") {
      return SQLiteUserModel;
    } else if (model === "sqlite-fresh") {
      await SQLiteUserModel.init(true);
      return SQLiteUserModel;
    } 
  }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;