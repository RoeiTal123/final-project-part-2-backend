const { Router } = require("express")
const { locationController } = require("../controller/location-controller.js")

const locationRouter = new Router()

locationRouter.get("/", locationController.getLocations)
locationRouter.get("/:locationid", locationController.getLocation)
locationRouter.post("/", locationController.addLocation)
locationRouter.put("/:locationid", locationController.updateLocation)
locationRouter.delete("/:locationid", locationController.deleteLocation)

module.exports = { locationRouter }