class PurchasesController {
  constructor(purchasesService) {
    this.purchasesService = purchasesService;
  }

  async buyItem(req, res) {
    const { userId, price } = req.body;

    try {
      const purchase = await this.purchasesService.buyItem(userId, price);
      return res.status(201).json({ message: "Purchase successful", purchase });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getPurchases(req, res) {
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
}

export default PurchasesController;
