const CustomerModel = require('../model/customerModel');
const { AppError } = require('../utils/appError');
const { parseId, validateCustomer } = require('../utils/validators');

const getAllCustomers = async (req, res, next) => {
  try {
    const data = await CustomerModel.getAll();

    res.json({ message: 'Data pelanggan berhasil diambil', data });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const data = await CustomerModel.getById(id);

    if (!data) throw new AppError(404, 'Pelanggan tidak ditemukan');

    res.json({ message: 'Data pelanggan berhasil diambil', data });
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customerData = validateCustomer(req.body);
    const data = await CustomerModel.create(customerData);

    res.status(201).json({ message: 'Pelanggan berhasil ditambahkan', data });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const customerData = validateCustomer(req.body);
    const data = await CustomerModel.update(id, customerData);

    if (!data) throw new AppError(404, 'Pelanggan tidak ditemukan');

    res.json({ message: 'Pelanggan berhasil diperbarui', data });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const deleted = await CustomerModel.remove(id);

    if (!deleted) throw new AppError(404, 'Pelanggan tidak ditemukan');

    res.json({ message: 'Pelanggan berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
