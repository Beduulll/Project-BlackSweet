const customers = [
  { name: "Adi Wicho Fairuz",   phone: "081234567801", address: "Jl. Merdeka No. 12, Medan" },
  { name: "Felix Andreas", phone: "082345678902", address: "Jl. Setia Budi No. 45, Medan" },
  { name: "Tengku Ahmad",   phone: "085678901234", address: "Perumahan Griya Asri Blok C3, Medan" },
  { name: "Samuel Yogi",   phone: "087712345678", address: "Jl. Gatot Subroto No. 88, Medan" },
  { name: "Agung Sitohang",  phone: "081398765432", address: "Kos Melati, Jl. Dr. Mansur No. 7, Medan" },
];

const services = [
  { service_name: "Cuci Kering",         price_per_kg: 6000,  description: "Dicuci bersih dan dikeringkan, siap dilipat. Estimasi 2 hari." },
  { service_name: "Cuci Setrika",        price_per_kg: 8000,  description: "Cuci, kering, setrika, dan dilipat rapi. Estimasi 2 hari." },
  { service_name: "Setrika Saja",        price_per_kg: 5000,  description: "Khusus setrika untuk pakaian yang sudah bersih. Estimasi 1 hari." },
  { service_name: "Express 6 Jam",       price_per_kg: 14000, description: "Layanan kilat cuci, kering, dan setrika selesai dalam 6 jam." },
  { service_name: "Selimut & Bed Cover", price_per_kg: 12000, description: "Perawatan khusus untuk selimut, bed cover, dan sprei tebal." },
];

const orders = [
  { customer_index: 1, service_index: 0, weight: 3,   status: "received",  days_ago: 0, pickup_in_days: 2 },
  { customer_index: 2, service_index: 3, weight: 2.5, status: "ironing",   days_ago: 1, pickup_in_days: 0 },
  { customer_index: 3, service_index: 4, weight: 5,   status: "completed", days_ago: 2, pickup_in_days: 0 },
  { customer_index: 0, service_index: 0, weight: 6,   status: "picked_up", days_ago: 5, pickup_in_days: 0 },
  { customer_index: 4, service_index: 2, weight: 2,   status: "drying",    days_ago: 1, pickup_in_days: 1 },
];

module.exports = { customers, services, orders };

const customers = [
  { name: "Adi Wicho Fairuz",   phone: "081234567801", address: "Jl. Merdeka No. 12, Medan" },
  { name: "Felix Andreas", phone: "082345678902", address: "Jl. Setia Budi No. 45, Medan" },
  { name: "Tengku Ahmad",   phone: "085678901234", address: "Perumahan Griya Asri Blok C3, Medan" },
  { name: "Samuel Yogi",   phone: "087712345678", address: "Jl. Gatot Subroto No. 88, Medan" },
  { name: "Agung Sitohang",  phone: "081398765432", address: "Kos Melati, Jl. Dr. Mansur No. 7, Medan" },
];

const services = [
  { service_name: "Cuci Kering",         price_per_kg: 6000,  description: "Dicuci bersih dan dikeringkan, siap dilipat. Estimasi 2 hari." },
  { service_name: "Cuci Setrika",        price_per_kg: 8000,  description: "Cuci, kering, setrika, dan dilipat rapi. Estimasi 2 hari." },
  { service_name: "Setrika Saja",        price_per_kg: 5000,  description: "Khusus setrika untuk pakaian yang sudah bersih. Estimasi 1 hari." },
  { service_name: "Express 6 Jam",       price_per_kg: 14000, description: "Layanan kilat cuci, kering, dan setrika selesai dalam 6 jam." },
  { service_name: "Selimut & Bed Cover", price_per_kg: 12000, description: "Perawatan khusus untuk selimut, bed cover, dan sprei tebal." },
];

const orders = [
  { customer_index: 1, service_index: 0, weight: 3,   status: "received",  days_ago: 0, pickup_in_days: 2 },
  { customer_index: 2, service_index: 3, weight: 2.5, status: "ironing",   days_ago: 1, pickup_in_days: 0 },
  { customer_index: 3, service_index: 4, weight: 5,   status: "completed", days_ago: 2, pickup_in_days: 0 },
  { customer_index: 0, service_index: 0, weight: 6,   status: "picked_up", days_ago: 5, pickup_in_days: 0 },
  { customer_index: 4, service_index: 2, weight: 2,   status: "drying",    days_ago: 1, pickup_in_days: 1 },
];

module.exports = { customers, services, orders };
