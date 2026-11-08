const ServiceModel = require('../model/serviceModel');
const { AppError } = require('../utils/appError');
const { parseId, validateService } = require('../utils/validators');

const getAllServices = async (req, res, next) => {
  try {
    const data = await ServiceModel.getAll();

    res.json({ message: 'Data layanan berhasil diambil', data });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const data = await ServiceModel.getById(id);

    if (!data) throw new AppError(404, 'Layanan tidak ditemukan');

    res.json({ message: 'Data layanan berhasil diambil', data });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const serviceData = validateService(req.body);
    const data = await ServiceModel.create(serviceData);

    res.status(201).json({ message: 'Layanan berhasil ditambahkan', data });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const serviceData = validateService(req.body);
    const data = await ServiceModel.update(id, serviceData);

    if (!data) throw new AppError(404, 'Layanan tidak ditemukan');

    res.json({ message: 'Layanan berhasil diperbarui', data });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const deleted = await ServiceModel.remove(id);

    if (!deleted) throw new AppError(404, 'Layanan tidak ditemukan');

    res.json({ message: 'Layanan berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };
