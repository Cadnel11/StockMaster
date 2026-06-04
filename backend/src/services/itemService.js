const Item = require('../models/Item');
const StockMovement = require('../models/StockMovement');

class ItemService {
  
  async getAllItems() {
    try {
      const items = await Item.find().sort({ createdAt: -1 });
      return { success: true, data: items };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getItemById(id) {
    try {
      const item = await Item.findById(id);
      if (!item) {
        return { success: false, error: 'Article non trouvé' };
      }
      return { success: true, data: item };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }


  async createItem(itemData, userId) {
    try {
      const newItem = new Item({
        ...itemData,
        createdBy: userId
      });
      
      await newItem.save();
      return { success: true, data: newItem };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateItem(id, updateData) {
    try {
      const item = await Item.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!item) {
        return { success: false, error: 'Article non trouvé' };
      }
      
      return { success: true, data: item };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteItem(id) {
    try {
      const item = await Item.findByIdAndDelete(id);
      if (!item) {
        return { success: false, error: 'Article non trouvé' };
      }
      return { success: true, message: 'Article supprimé avec succès' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addStock(id, quantity, userId) {
    try {
      const item = await Item.findById(id);
      if (!item) {
        return { success: false, error: 'Article non trouvé' };
      }

      const previousQuantity = item.quantity;
      item.quantity += quantity;
      await item.save();

      const movement = new StockMovement({
        itemId: id,
        userId: userId,
        type: 'add',
        quantity: quantity,
        previousQuantity: previousQuantity,
        newQuantity: item.quantity,
        reason: 'Ajout de stock'
      });
      await movement.save();

      return { 
        success: true, 
        data: item, 
        message: `${quantity} unité(s) ajoutée(s) au stock`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async removeStock(id, quantity, userId) {
    try {
      const item = await Item.findById(id);
      if (!item) {
        return { success: false, error: 'Article non trouvé' };
      }

      if (item.quantity < quantity) {
        return { 
          success: false, 
          error: `Stock insuffisant. Disponible: ${item.quantity}, Demandé: ${quantity}` 
        };
      }

      const previousQuantity = item.quantity;
      item.quantity -= quantity;
      await item.save();

      const movement = new StockMovement({
        itemId: id,
        userId: userId,
        type: 'remove',
        quantity: quantity,
        previousQuantity: previousQuantity,
        newQuantity: item.quantity,
        reason: 'Retrait de stock'
      });
      await movement.save();

      return { 
        success: true, 
        data: item, 
        message: `${quantity} unité(s) retirée(s) du stock`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getItemHistory(id) {
    try {
      const movements = await StockMovement.find({ itemId: id })
        .sort({ createdAt: -1 })
        .populate('userId', 'name email');
      
      return { success: true, data: movements };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ItemService();