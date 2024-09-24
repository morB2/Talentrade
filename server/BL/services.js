// Require dependencies for services handling
const servicesDL = require("../DL/services");
const userDL = require("../DL/user");
const commentBl = require("./comments");
const jwt = require("../JWT.JS");

const checkValidation = async (userId, serviceId) => {  
  const service = await servicesDL.getDetailsServiceById(serviceId);  
  return service.userId == userId;
};

// Create a new service
const createService = async (service) => {
  return await servicesDL.createService(service);
};

// Update a service by service ID
const updateService = async (id, service) => {
  return await servicesDL.updateService(id, service);
};

// Delete a service by user ID and service ID
const deleteService = async (id) => {
  await commentBl.deleteAllComment(id);
  return await servicesDL.deleteService(id);
};

// Fetch services with optional filters
const fetchServices = async (
  category,
  sortBy,
  subCategory,
  userID,
  filterType
) => {
  if (category !== "All")
    return await servicesDL.getServices(
      category,
      sortBy,
      subCategory,
      filterType
    );
  return await servicesDL.getAllServices(
    sortBy,
    subCategory,
    userID,
    filterType
  );
};

// Fetch a service by service ID
const fetchServiceById = async (id) => {
  return await servicesDL.getServiceById(id);
};

// Close or open a service
const toggleServiceStatus = (serviceId, isOpen) => {
  return servicesDL.toggleServiceStatus(serviceId, isOpen);
};

// Export the service functions
module.exports = {
  checkValidation,
  createService,
  updateService,
  deleteService,
  fetchServices,
  fetchServiceById,
  toggleServiceStatus,
};
