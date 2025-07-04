import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { COOKIE_PASSWORD } from "./config.js";
import { dark, light } from "@adminjs/themes";
import dotenv from "dotenv";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";

import User from "../models/user.js";
import Bus from "../models/bus.js";
import Ticket from "../models/ticket.js";
dotenv.config();
AdminJS.registerAdapter(AdminJSMongoose);

const Default_Admin = {
  email: process.env.ADMIN_LOGIN_EMAIL,
  password: process.env.ADMIN_LOGIN_PASSWORD
};
const authenticate = async (email, password) => {
  if (email === Default_Admin.email && password === Default_Admin.password) {
    return Promise.resolve(Default_Admin);
  }
  return null;
};
export const buildAdminJS = async (app) => {
  const admin = new AdminJS({
    resources: [{ resource: User }, { resource: Bus }, { resource: Ticket }],
    branding: {
      companyName: "Bus Booking",
      withMadeWithLove: false,
    },

    defaultTheme: dark.id,
    availableThemes: [dark, light],
    rootPath: "/admin",
  });
  const MongoDBStore = ConnectMongoDBSession(session);
  const sessionStore = new MongoDBStore({ uri: process.env.MONGO_URI, collection: "sessions" });
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate,
    cookieName: "adminjs",
    cookiePassword: COOKIE_PASSWORD,
  },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
      name: "adminjs",
    }
  );
  app.use(admin.options.rootPath, adminRouter);
};