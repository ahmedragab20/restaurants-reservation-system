import { vFetch } from "very-good-fetch";
import { printerr } from "./console";

export const getBranches = async (vOptions) => {
  try {
    const response = await vFetch("/branches", {
      vOptions,
    });

    return response;
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

    return await vFetch("/branches/update-reservations", {
      method: "PUT",
      body: JSON.stringify({
        accepts_reservations: reservations,
      }),
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

    return await vFetch(`/branches/${branch.id}`, {
      method: "PUT",
      body: JSON.stringify({ branch }),
    });
  } catch (error) {
    console.error(error);
  }
};
