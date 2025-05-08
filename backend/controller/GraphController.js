import GraphModel from "../model/GraphModel.js";

class GraphController {
  async saveGraph(req, res) {
    try {
      const { userId, url, type, fileName } = req.body;
      if (!userId || !url || !type || !fileName) {
        return res.status(400).json({ error: "User ID, URL, type, and filename are required." });
      }
      const savedGraph = await GraphModel.create({ userId, url, type, fileName });
      return res.status(201).json(savedGraph);
    } catch (error) {
      console.error("Error saving graph:", error);
      return res.status(500).json({ error: "Failed to save graph." });
    }
  }

  async getGraphs(req, res) {
    try {
      const { userId, type } = req.query;
      const whereClause = {};
      if (userId) {
        whereClause.userId = userId;
      }
      if (type) {
        whereClause.type = type;
      }
      const graphs = await GraphModel.read(whereClause);
      res.json({ graphs });
    } catch (error) {
      console.error("Error getting graphs:", error);
      return res.status(500).json({ error: "Failed to retrieve graphs." });
    }
  }

  async deleteGraph(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Graph ID is required." });
      }
      const deleted = await GraphModel.delete({ id });
      res.json({ message: `Graph with ID ${id} deleted.` });
    } catch (error) {
      console.error("Error deleting graph:", error);
      return res.status(500).json({ error: "Failed to delete graph." });
    }
  }
}

export default new GraphController();