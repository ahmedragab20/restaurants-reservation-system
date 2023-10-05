/**
 * @description This is a simple proxy server that will be used to
 *              make requests to the external API from the client.
 */

const PORT = 4000;

const express = require("express");
const cors = require("cors");
const {
  getBranches,
  updateBranchsReservations,
  updateBranch,
} = require("./controllers");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

// get all branches
app.get("/branches", getBranches);
// update branch reservations
app.put("/branches/update-reservations", updateBranchsReservations);
// update branch
app.put("/branches/:id", updateBranch);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
