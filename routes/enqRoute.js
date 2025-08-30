const express = require("express")
const { getEnqs, addEnq, getAEnq, updateEnq, deleteEnq } = require("../controller/enqCtrl")

const enqRoute = express.Router()

enqRoute.get("/", getEnqs)
enqRoute.post("/add-enq/", addEnq)
enqRoute.get("/get-enquiry/:_id", getAEnq)
enqRoute.put("/update/:_id", updateEnq)
enqRoute.delete("/delete/:_id", deleteEnq);

module.exports = enqRoute