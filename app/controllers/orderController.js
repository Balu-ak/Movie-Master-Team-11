const db = require('../models'); // Import your models
const Order = db.order
const User = db.user
const Movie = db.movie

// Create a new order
exports.createOrder = async (req, res) => {
    const { userId, totalCost, movieIds } = req.body;
  
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new order
      const order = await Order.create({
        totalCost,
        ordered_date: new Date().toISOString(),
      });
  
      // Associate the order with the user
      await user.addOrder(order);
  
      // Associate the order with selected movies
      if (movieIds && movieIds.length > 0) {
        const selectedMovies = await Movie.findAll({ where: { id: movieIds } });
        if (selectedMovies.length > 0) {
          await order.addMovies(selectedMovies);
        }
      }
  
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [{ model: Movie}],
      });
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
// Get an order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id, {
        include: [{ model: Movie }],
      });
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
// Delete an order
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
  
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      await order.destroy();
      return res.status(200).json({ message: 'Order is deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Retrieve orders associated with the user
      const orders = await user.getOrders({
        include: [{ model: Movie }],
      });
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  