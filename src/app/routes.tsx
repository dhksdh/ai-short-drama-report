import { createHashRouter } from "react-router";
import { Root } from "./Root";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
  },
]);
