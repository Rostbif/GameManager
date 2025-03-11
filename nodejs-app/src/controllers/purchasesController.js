class PurchasesController {
  constructor(purchasesService) {
    this.purchasesService = purchasesService;
  }

  async buyItem(req, res) {
    const { userId, price } = req.body;

    try {
      const purchase = await this.purchasesService.buyItem(userId, price);
      res.status(201).json({ message: "Purchase successful", purchase });
      console.log(
        `Succeeded to purchase an item with price ${price} for user ${userId}`
      );
    } catch (error) {
      console.log(`Couldn't buy item ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  async getPurchasesOfUser(req, res) {
    const { userId } = req.params;

    try {
      const purchases = await this.purchasesService.getPurchases(userId);
      return res.status(200).json(purchases);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving purchases", error });
    }
  }

  async getPurchases(req, res) {
    try {
      const purchases = await this.purchasesService.getPurchases();
      return res.status(200).json(purchases);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving purchases", error });
    }
  }
}

export default PurchasesController;
