const StatsModel = require('../model/statsModel');

const getSummary = async (req, res, next) => {
  try {
    const data = await StatsModel.getSummary();

    res.json({ message: 'Ringkasan berhasil diambil', data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
