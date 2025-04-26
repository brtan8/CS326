import InMemoryGraphModel from "./GraphModel.js";

class _GraphModelFactory {
    getModel() {
    return InMemoryGraphModel;
    }
}

const GraphModelFactory = new _GraphModelFactory();
export default GraphModelFactory;