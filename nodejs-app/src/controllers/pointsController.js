class PointsController {
  constructor(pointsService) {
    this.pointsService = pointsService;
  }

  // Method to add points to a user
  async addPoints(req, res) {
    const { userId, points } = req.body;
    try {
      const result = await this.pointsService.addPoints(userId, points);
      res.status(200).json(result);
      console.log(`Succeeded to add ${points} to user ${userId}`);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Method to get points of all users
  async getPoints(req, res) {
    try {
      const result = await this.pointsService.getPoints();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Method to expire points of all users
  async expirePoints(req, res) {
    try {
      const result = await this.pointsService.expirePoints();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default PointsController;
