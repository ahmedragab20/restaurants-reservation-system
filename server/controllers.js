const axios = require("axios");
const BASE_URL = "https://api.foodics.dev/v5/";
async function getBranches(req, res) {
  try {
    const reqURL = req.protocol + "://" + req.get("host") + req.originalUrl;
    const url = reqURL.replace("http://localhost:4000/", BASE_URL);

    const options = {
      method: "GET",
      url,
      headers: {
        Authorization: `Bearer ${process.env.VUE_APP_API_ACCESS_TOKEN}`,
      },
    };

    await axios
      .request(options)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function updateBranchsReservations(req, res) {
  try {
    // update more than one branch at once
    // this is hella wrong but i need to update more than one using a singule endpoint!🤦🏻‍♂️

    const reqBody = req?.body || {};

    if (!reqBody?.accepts_reservations?.length) {
      return res.status(400).json({
        error: "accepts_reservations is required",
        message:
          "send at least one branch to update with accepts_reservations field as true or false and branch id",
        expected_schema: {
          accepts_reservations: [
            {
              id: "branch_id",
              accepts_reservations: "true or false",
            },
          ],
        },
      });
    }

    reqBody?.accepts_reservations?.forEach(async (branch) => {
      if (!branch?.id) {
        return res.status(400).json({
          error: "id is required",
          message: "send branch id",
          expected_schema: {
            accepts_reservations: [
              {
                id: "branch_id",
                accepts_reservations: "true or false",
              },
            ],
          },
        });
      }
      if (branch?.accepts_reservations === undefined) {
        return res.status(400).json({
          error: "accepts_reservations is required",
          message: "send accepts_reservations field as true or false",
          expected_schema: {
            accepts_reservations: [
              {
                id: "branch_id",
                accepts_reservations: "true or false",
              },
            ],
          },
        });
      }

      const reqURL = req.protocol + "://" + req.get("host") + req.originalUrl;

      const u = reqURL.replace("http://localhost:4000/", BASE_URL);

      const url = `${u?.replace("update-reservations", branch?.id)}`;

      const options = {
        method: "PUT",
        url,
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_API_ACCESS_TOKEN}`,
        },
        data: branch,
      };
      await axios.request(options);
    });
  } catch (error) {
    console.error(error);
  } finally {
    res.status(200).json({
      message: "updated successfully",
      updatedReservations: req?.body?.accepts_reservations,
    });
  }
}

module.exports = {
  getBranches,
  updateBranchsReservations,
};
