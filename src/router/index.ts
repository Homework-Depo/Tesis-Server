import { Express, Router } from "express";
import { LoginRouter, LogoutRouter, SettingsRouter } from "../components";

const routesList: [string, Router][] = [
  ["/login", LoginRouter],
  ["/settings", SettingsRouter],
  ["/logout", LogoutRouter]
];

export const routes = (app: Express) => {
  routesList.forEach(([path, controller]) => {
    app.use(path, controller);
  });
};