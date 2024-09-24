const express = require("express");
const router = express.Router();
const servicesBL = require("../BL/services");
const jwt = require("../JWT.JS")

// Route to create a new service
router.post("/", async (req, res) => {
  try {
    const service = req.body;
    const result = await servicesBL.createService(service);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update a service by ID
router.put("/:id", async (req, res) => {
  try {    
    const serviceId = req.params.id;
    const service = req.body.formData;
    
    if (await servicesBL.checkValidation(req.body.userId, serviceId)) {
      const result = await servicesBL.updateService(serviceId, service);
      res.status(200).json(result);
    }
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a service by ID
router.delete("/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    if (
      jwt.checkAdmin ||
      (await servicesBL.checkValidation(req.body.userId, serviceId))
    ) {
      const result = await servicesBL.deleteService(serviceId);
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to fetch all services with optional filters
router.get("/", async (req, res) => {
  try {
    const { category, sortBy, subCategory, userID, filterType } = req.query;
    const services = await servicesBL.fetchServices(
      category,
      sortBy,
      subCategory,
      userID,
      filterType
    );
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch a service by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await servicesBL.fetchServiceById(id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close or open a service
router.post("/:id/status", async (req, res) => {
  try {
    const { isOpen } = req.body;
    if(await servicesBL.checkValidation(req.body.userId, req.params.id)){
      await servicesBL.toggleServiceStatus(req.params.id, isOpen);
    res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
