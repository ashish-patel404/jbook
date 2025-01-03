import { createSelector } from "reselect";
import { RootState } from "../state";

const selectOrder = (state: RootState) => state.cells.order;
const selectData = (state: RootState) => state.cells.data;

export const selectCells = createSelector(
  [selectOrder, selectData],
  (order, data) => order.map((id) => data[id])
);
