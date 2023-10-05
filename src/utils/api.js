import axios from "axios";
import { printerr } from "./console";

export const getBranches = async () => {
  try {
    const { data } = await axios.get(
      "/branches?include[0]=sections&include[1]=sections.tables"
    );

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updateBranchsReservations = async (reservations) => {
  try {
    if (!reservations?.length) {
      return printerr(
        "send at least one branch to update with accepts_reservations field as true or false and branch id"
      );
    }

    return await axios.put("/branches/update-reservations", {
      accepts_reservations: reservations,
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateBranch = async (branch) => {
  try {
    if (!branch?.id) {
      return printerr("send branch id");
    }

    return axios.put(`/branches/${branch.id}`, {
      branch,
    });
  } catch (error) {
    console.error(error);
  }
};
