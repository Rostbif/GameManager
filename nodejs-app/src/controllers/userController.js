class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async createUser(req, res) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
      console.log("user created successfully");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const user = await this.userService.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await this.userService.getUsers();
      if (!users === 0 || users.length === 0) {
        return res.status(404).json({ message: "no users to return" });
      }
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default UserController;
