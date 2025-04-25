import InMemoryLoginModel from "./LoginModel.js";

class _ModelFactory {
  getModel() {
    return InMemoryLoginModel;
  }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;