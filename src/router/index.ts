import { Express, Router } from "express";
import { LoginRouter } from "../components";

const routesList: [string, Router][] = [
  ["/auth/login", LoginRouter]
];

export const routes = (app: Express) => {
  routesList.forEach(([path, controller]) => {
    app.use(path, controller);
  });
};