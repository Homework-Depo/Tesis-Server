import { Express, Router } from "express";
import {
  LoginRouter,
  LogoutRouter,
  SettingsRouter,
  ClientsRouter
} from "../components";

const routesList: [string, Router][] = [
  ["/login", LoginRouter],
  ["/settings", SettingsRouter],
  ["/logout", LogoutRouter],
  ["/clients", ClientsRouter]
];

export const routes = (app: Express) => {
  routesList.forEach(([path, controller]) => {
    app.use(path, controller);
  });
};