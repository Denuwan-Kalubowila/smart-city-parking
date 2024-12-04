const express= require('express');
const router = express.Router();

const parkingController = require("../controllers/parking_controller");

router.get("/spot",parkingController.getSpot);
router.get("spot/:id",parkingController.getSpotById);
router.post("/spot",parkingController.createSpot);
router.put("/spot/:id",parkingController.updateSpot);
router.delete("/spot/:id",parkingController.deleteSpot);
router.get("/spot/status/avalable",parkingController.availableSpots);

module.exports = router;