const db = require("../dbConfig");

// Create a new service
const createService = async (service) => {
  const [result] = await db.query(
    "INSERT INTO services (userId, type, title, description, category, subcategories, compensation) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      service.userId,
      service.type,
      service.title,
      service.description,
      service.category,
      JSON.stringify(service.subcategories),
      service.compensation,
    ]
  );
  return { id: result.insertId, ...service };
};

// Retrieve service details by ID
const getDetailsServiceById = async (id) => {
  const [rows] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
  return rows[0];
};

// Retrieve service by ID along with user details
const getServiceById = async (id) => {
  const query = `
      SELECT 
          s.*, 
          u.username as userName, 
          u.email as userEmail, 
          u.phone as userPhone
      FROM 
          services s
      JOIN 
          users u
      ON 
          s.userId = u.id
      WHERE 
          s.id = ?
    `;
  const [rows] = await db.query(query, [id]);
  return rows[0];
};

// Update an existing service by ID
const updateService = async (id, service) => {
  const [result] = await db.query(
    "UPDATE services SET title = ?, description = ?, category = ?, subcategories = ?, compensation = ? WHERE id = ?",
    [
      service.title,
      service.description,
      service.category,
      JSON.stringify(service.subcategories),
      service.compensation,
      id,
    ]
  );
  return { id, ...service };
};

// Delete a service by ID
const deleteService = async (id) => {
  const [result] = await db.query("DELETE FROM services WHERE id = ?", [id]);
  return result.affectedRows;
};

// Retrieve all services for admin
const getAllServicesAdmin = async () => {
  const [rows] = await db.query("SELECT * FROM services");
  return rows;
};

// Merge functions to retrieve services based on filters
const getServices = async (category, sortBy, subCategories, filterType) => {
  let query = "SELECT * FROM services WHERE category = ?";
  let params = [category];

  if (subCategories && subCategories.length > 0) {
    subCategories = subCategories.split(",");
    query += " AND JSON_CONTAINS(subcategories, ?)";
    params.push(JSON.stringify(subCategories));
  }

  if (filterType && filterType != "all") {
    query += " AND type = ?";
    params.push(filterType == "requests" ? "request" : "offer");
  }

  query += ` ORDER BY ${sortBy || "created_at"} DESC`;

  const [rows] = await db.query(query, params);
  return rows;
};

// Retrieve all services with optional filters
const getAllServices = async (sortBy, subCategory, userID, filterType) => {
  let query = "SELECT * FROM services";
  let params = [];
  let conditions = [];

  if (subCategory) {
    conditions.push("JSON_OVERLAPS(subcategories, ?)");
    params.push(JSON.stringify([subCategory]));
  }
  if (userID !== "null") {
    conditions.push("userId = ?");
    params.push(userID);
  }
  if (filterType && filterType !== "all") {
    conditions.push("type = ?");
    params.push(filterType == "requests" ? "request" : "offer");
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY ${sortBy || "created_at"} DESC`;

  const [rows] = await db.query(query, params);
  return rows;
};

// Close or open service
const toggleServiceStatus = async (serviceId, isOpen) => {
  const query = "UPDATE services SET is_open = ? WHERE id = ?";
  await db.query(query, [isOpen, serviceId]);
};

module.exports = {
  createService,
  getServiceById,
  updateService,
  deleteService,
  getAllServices,
  getServices,
  getAllServicesAdmin,
  getDetailsServiceById,
  toggleServiceStatus,
};
