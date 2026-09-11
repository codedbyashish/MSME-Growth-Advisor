import Inventory from '../models/Inventory.js';

/**
 * @desc    Get all inventory items for authenticated user
 * @route   GET /api/inventory
 * @access  Private
 */
export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(inventory);
  } catch (error) {
    console.error(`Get inventory error: ${error.message}`);
    return res.status(500).json({ message: 'Error fetching inventory' });
  }
};

/**
 * @desc    Create a new product in inventory
 * @route   POST /api/inventory
 * @access  Private
 */
export const createProduct = async (req, res) => {
  try {
    const { name, stock, unit, minStock, unitPrice, category } = req.body;

    if (!name || unitPrice === undefined) {
      return res.status(400).json({ message: 'Product name and unit price are required' });
    }

    const count = await Inventory.countDocuments({ user: req.user._id });
    const productId = `PRD-${String(count + 1).padStart(2, '0')}`;

    const newProduct = await Inventory.create({
      user: req.user._id,
      productId,
      name,
      stock: Number(stock || 0),
      unit: unit || 'Meters',
      minStock: Number(minStock || 100),
      unitPrice: Number(unitPrice),
      category: category || 'General',
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(`Create product error: ${error.message}`);
    return res.status(500).json({ message: error.message || 'Error creating product' });
  }
};

/**
 * @desc    Update stock / product details
 * @route   PUT /api/inventory/:id
 * @access  Private
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Inventory.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(`Update product error: ${error.message}`);
    return res.status(500).json({ message: 'Error updating product' });
  }
};

/**
 * @desc    Delete a product from inventory
 * @route   DELETE /api/inventory/:id
 * @access  Private
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Inventory.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted', id: req.params.id });
  } catch (error) {
    console.error(`Delete product error: ${error.message}`);
    return res.status(500).json({ message: 'Error deleting product' });
  }
};
