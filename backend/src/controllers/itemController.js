const {validationResult} = require('express-validator')
const itemService = require('../services/itemService');
const { count } = require('console');



class ItemController {
  async getAllItems(req, res) {
    const result = await itemService.getAllItems();

    if(!result.success){
      return res.status(500).json({
        status: "error",
        message: result.error
      });
    }

    res.status(200).json({
      status: "success",
      count: result.data.length,
      data: result.data,
    });
  }


  async getItemById(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({
        status: "error",
        errors: errors.array()
      })
    }

    const result = await itemService.getItemById(req.params.id);

    if(!result.success)
    {
      return res.status(404).json({
        status: 'error',
        message: result.error
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.data,
    })
  };

  async createItem(req, res){
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const result = await itemService.createItem(req.body, req.user.id);

    if(!result.success){
      return res.status(400).json({
        status: 'error',
        message: result.error,
      })
    }
    res.status(201).json({
      status: 'success',
      message: 'Article créé avec succès',
      data: result.data 
    });
  }

  async updateItem(req, res)
  {
    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    };

    const result = await itemService.updateItem(req.params.id, req.body);

    if(!result.success)
    {
      return res.status(404).json({
        status: 'error',
        message: result.error,
      });
    };

    res.status(200).json({
      status: 'success',
      message: 'Article modifié avec succès',
      data: result.data
    });
  }

  async deleteItem(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({
        status: 'error',
        message: error.array(),
      })
    }

    const result = await itemService.deleteItem(req.params.id);

    if(!result.success)
    {
      return res.status(404).json({
        status: 'error',
        message: result.error,
      });
    };

    res.status(200).json({
      status: 'success',
      message: result.message,
    })
  }

  async addStock(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { quantity } = req.body;

    const result = await itemService.addStock(req.params.id, quantity);

    if(!result.success){
      return res.status(400).json({
        status: 'error',
        message: result.error 
      });
    };

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data,
      movement: result.movement,
    });
  }

  async removeStock(req, res)
  {
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      })
    }

    const {quantity} = req.body;

    const result = await itemService.removeStock(req.params.id, quantity, req.user.id);

    if(!result.success)
    {
      return res.status(400).json({
        status: 'error',
        message: result.error,
      })
    };

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: result.data,
      movement: result.movement,
    });
  }

  async getItemHistory(req, res)
  {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({
        status: 'error',
        errors: errors.array(),
      });
    };

    const result = await itemService.getItemHistory(req.params.id);

    if(!result.success)
    {
      return res.status(500).json({
        status: 'error',
        message: result.error,
      });
    }

    res.status(200).json({
      status: 'success',
      count: result.data.length,
      data: result.data,
    });
  }
}

module.exports = new ItemController()