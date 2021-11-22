/** @format */

import path from "path";
import { dirname, filename } from "dirname-filename-esm";
import { createRequire } from "module";
import fs from "fs-extra";
import { globby } from "globby";
import { marked } from "marked";
import matter from "gray-matter";
import express from "express";
import { engine } from "express-handlebars";
import chalk from "chalk";
import helpers from "./helpers.js";

const __dirname = dirname(import.meta);
const require = createRequire(import.meta.url);
const config = require("../../data/config.json");
const labels = require("../../data/labels.json");

const BUILD_PATH = path.join(__dirname, "..", "..", "dist");
const DATA_PATH = path.join(__dirname, "..", "..", "data");

const { readFile, outputFile } = fs;

const app = express();

app.engine("handlebars", engine({ helpers }));
app.set("view engine", "handlebars");
app.set("layoutsDir", path.join(__dirname, "views", "layouts"));
app.set("views", path.join(__dirname, "views"));

function log(data) {
    console.log(chalk.cyan(`[generator] ${data}`));
}

async function loadMarkdown() {
    const mdFiles = await globby("**/*.md", { cwd: DATA_PATH });
    return Promise.all(
        mdFiles.map(async (fileName) => {
            const fullPath = path.join(DATA_PATH, fileName);
            const contents = await readFile(fullPath, "utf-8");
            const parsed = matter(contents);
            const outputFileName = fileName.replace(".md", "");
            return {
                ...parsed.data,
                outputFileName,
                id: outputFileName.replaceAll("/", "-"),
                pageContent: marked(parsed.content),
            };
        })
    );
}

const DEFAULT_TEMPLATE = "_default";

function renderPage(page) {
    return new Promise((resolve, reject) => {
        log(`Generating ${chalk.yellow(page.id)}...`);
        app.render(
            page.template || DEFAULT_TEMPLATE,
            {
                ...page,
                config,
                labels,
            },
            async (error, html) => {
                if (error) {
                    reject(error);
                    return;
                }
                await outputFile(
                    path.join(BUILD_PATH, `${page.outputFileName}.html`),
                    html
                );
                resolve(true);
            }
        );
    });
}

(async () => {
    log(`Getting data from ${chalk.yellow(DATA_PATH)}:`);
    const data = await loadMarkdown();
    const pages = [
        ...data,
        {
            title: "Home",
            id: "index",
            outputFileName: "index",
            template: "index",
        },
        {
            title: "Projects",
            id: "projects",
            outputFileName: "projects",
            template: "projects-list",
            projects: data.filter((x) => x.id.startsWith("project")),
        },
    ];

    try {
        const results = await Promise.all(pages.map(renderPage));
        log(`Generated ${chalk.yellow(results.length)} pages`);
    } catch (error) {
        console.log(chalk.red(`[generator] Error generating site`));
        console.log(error);
    }
})();
