import { Express, Router } from "express";
import {
  LoginRouter,
  LogoutRouter,
  SettingsRouter,
  ClientsRouter,
  SessionRouter,
  AuthCodeRouter,
  CasesRouter
} from "../components";

const routesList: [string, Router][] = [
  ["/login", LoginRouter],
  ["/settings", SettingsRouter],
  ["/logout", LogoutRouter],
  ["/clients", ClientsRouter],
  ["/session", SessionRouter],
  ["/authCode", AuthCodeRouter],
  ["/cases", CasesRouter]
];

export const routes = (app: Express) => {
  routesList.forEach(([path, controller]) => {
    app.use(path, controller);
  });
};