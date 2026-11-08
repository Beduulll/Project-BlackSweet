const { get } = require('../utils/dbAsync');

const getSummary = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM orders
         WHERE status NOT IN ('completed', 'picked_up')) AS active_orders,
      (SELECT COUNT(*) FROM orders WHERE status = 'completed') AS ready_orders,
      (SELECT COALESCE(SUM(total_price), 0) FROM orders
         WHERE date(order_date) = date('now', 'localtime')) AS today_revenue,
      (SELECT COALESCE(SUM(total_price), 0) FROM orders
         WHERE date(order_date) >= date('now', 'localtime', 'start of month')
           AND date(order_date) <  date('now', 'localtime', 'start of month', '+1 month')) AS month_revenue,
      (SELECT COALESCE(SUM(total_price), 0) FROM orders
         WHERE date(order_date) >= date('now', 'localtime', 'start of month', '-1 month')
           AND date(order_date) <  date('now', 'localtime', 'start of month')) AS last_month_revenue,
      (SELECT COUNT(*) FROM customers) AS total_customers
  `;

  const row = await get(query);

  return row;
};

module.exports = { getSummary };
