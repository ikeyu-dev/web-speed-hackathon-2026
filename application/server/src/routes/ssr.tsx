import { readFileSync } from "fs";
import path from "path";

import { Request, Response, Router } from "express";

import { CLIENT_DIST_PATH } from "@web-speed-hackathon-2026/server/src/paths";

const rawTemplate = readFileSync(path.resolve(CLIENT_DIST_PATH, "index.html"), "utf-8");

const shellHtml = `<div style="display:flex;justify-content:center;font-family:sans-serif"><div style="display:flex;min-height:100vh;max-width:100%"><aside style="width:72px"></aside><main style="width:100%;max-width:640px;padding:16px;color:#042f2e">読込中...</main></div></div>`;

const htmlWithShell = rawTemplate.replace(
  '<div id="app"></div>',
  `<div id="app">${shellHtml}</div>`,
);

const htmlWithAbsolutePaths = htmlWithShell
  .replace(/src="scripts\//g, 'src="/scripts/')
  .replace(/href="styles\//g, 'href="/styles/');

export const ssrRouter = Router();

ssrRouter.use("{*path}", (req: Request, res: Response) => {
  const depth = req.originalUrl.split("/").filter(Boolean).length;
  res.status(200).type("text/html").send(depth <= 1 ? htmlWithShell : htmlWithAbsolutePaths);
});
