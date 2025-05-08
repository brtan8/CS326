import ModelFactory from "../model/LoginFactory.js";

class LoginController {
  constructor() {
    ModelFactory.getModel().then((model) => {
      this.model = model;
    });
  }

  async getAllLogins(req, res) {
    const Login = await this.model.read();
    res.json({ Login });
  }


  async addLogin(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Login description is required." });
      }

      const Login = await this.model.create(req.body);

      const file = req.body.file
        ? `with file: ${req.body.filename}`
        : "without file";

      return res.status(201).json(Login);
    } catch (error) {
      console.error("Error adding Login:", error);
      return res
        .status(500)
        .json({ error: "Failed to add Login. Please try again." });
    }
  }

  async clearLogins(req, res) {
    await this.model.delete(req.query);
    res.json(await this.model.read());
  }

  async deleteLogin(req, res) {
    const { uid } = req.query;  // Get uid from query string
    if (!uid) {
      return res.status(400).json({ error: "UID is required to delete the login." });
    }

    try {
      // Assuming `this.model.delete()` takes a UID to delete a specific login
      const deletedLogin = await this.model.delete({ uid });
      if (!deletedLogin) {
        return res.status(404).json({ error: "User not found or could not delete." });
      }

      // Return all logins after deletion, or you can just confirm deletion
      return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error deleting login:", error);
      return res.status(500).json({ error: "Failed to delete login. Please try again." });
    }
  }

  async updatePassword(req, res) {
    try {
      const { uid, newPassword } = req.body;

      // Check if both UID and newPassword are provided
      if (!uid || !newPassword) {
        return res.status(400).json({ error: 'Missing UID or new password.' });
      }

      // Find the user by UID
      const user = await User.findByUid(uid);  // Make sure this method is correct
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Hash the new password (make sure to hash the password before saving it!)
      user.password = newPassword;  // Ideally, hash the password before saving it
      await user.save();

      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ error: 'Failed to update password. Please try again.' });
    }
  }
}

export default new LoginController();