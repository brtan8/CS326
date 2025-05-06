import LoginModel from "../model/LoginFactory.js";

class LoginController {
  constructor() {
    this.model = LoginModel.getModel();
  }

  async getAllLogins(request, result) {
    const Logins = await this.model.read();
    result.json(Logins);
  }

  async addLogin(request, result) {
    try {
      if (!request.body) {
        return result.status(400).json({ error: "error." });
      }

      const Login = await this.model.create(request.body);

      const file = request.body.file
        ? `with file: ${request.body.filename}`
        : "without file";

      return result.status(201).json(Login);
    } catch (error) {
      console.error("Error adding Login:", error);
      return result
        .status(500)
        .json({ error: "Failed to add Login. Please try again." });
    }
  }

  static async clearLogins(req, res) {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required to delete a user' });
    }
  
    try {
      await InMemoryLoginModel.delete(email); // Use your fixed async delete
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}

export default new LoginController();