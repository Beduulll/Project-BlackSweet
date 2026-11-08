const OrderModel = require('../model/orderModel');
const { AppError } = require('../utils/appError');
const { ORDER_STATUSES, parseId, validateOrder } = require('../utils/validators');

const getAllOrders = async (req, res, next) => {
  try {
    const data = await OrderModel.getAll();

    res.json({ message: 'Data pesanan berhasil diambil', data });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const data = await OrderModel.getById(id);

    if (!data) throw new AppError(404, 'Pesanan tidak ditemukan');

    res.json({ message: 'Data pesanan berhasil diambil', data });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const orderData = validateOrder(req.body);
    const data = await OrderModel.create(orderData);

    res.status(201).json({ message: 'Pesanan berhasil dibuat', data });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const status = (req.body || {}).status;

    if (!ORDER_STATUSES.includes(status)) {
      throw new AppError(400, 'Status pesanan tidak valid');
    }

    const data = await OrderModel.updateStatus(id, status);

    if (!data) throw new AppError(404, 'Pesanan tidak ditemukan');

    res.json({ message: 'Status pesanan berhasil diperbarui', data });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const deleted = await OrderModel.remove(id);

    if (!deleted) throw new AppError(404, 'Pesanan tidak ditemukan');

    res.json({ message: 'Pesanan berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder };
