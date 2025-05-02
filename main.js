"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => FaviconPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var FaviconPlugin = class extends import_obsidian.Plugin {
  async onload() {
    console.log("Favicon Plugin + Enhancements loaded");
    this.registerMarkdownCodeBlockProcessor("favicon", async (source, el, ctx) => {
      const urls = source.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
      urls.forEach((url) => {
        if (!url.startsWith("http")) return;
        const img = this.createFaviconImg(url);
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.innerText = url;
        link.style.textDecoration = "none";
        link.style.color = "inherit";
        link.title = `Visit ${url}`;
        const container = document.createElement("div");
        container.style.marginBottom = "4px";
        container.appendChild(img);
        container.appendChild(link);
        el.appendChild(container);
      });
    });
    this.registerDomEvent(document, "DOMContentLoaded", () => this.injectFaviconsToLinks());
    this.registerEvent(
      this.app.workspace.on("layout-change", () => this.injectFaviconsToLinks())
    );
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem(
          (item) => item.setTitle("Insert Favicon Block").setIcon("image-file").onClick(() => {
            const selected = editor.getSelection().trim();
            const insert = selected && selected.startsWith("http") ? `\`\`\`favicon
${selected}
\`\`\`
` : `\`\`\`favicon
https://example.com
\`\`\`
`;
            editor.replaceSelection(insert);
          })
        );
      })
    );
  }
  createFaviconImg(url) {
    const img = document.createElement("img");
    img.src = `https://www.google.com/s2/favicons?sz=16&domain_url=${encodeURIComponent(url)}`;
    img.alt = `Favicon for ${url}`;
    img.width = 16;
    img.height = 16;
    img.style.verticalAlign = "middle";
    img.style.marginRight = "6px";
    img.title = `Favicon for ${url}`;
    img.onerror = () => {
      img.style.display = "none";
    };
    return img;
  }
  injectFaviconsToLinks() {
    const previews = document.querySelectorAll(".markdown-preview-view");
    previews.forEach((preview) => {
      const anchors = preview.querySelectorAll("a[href^='http']");
      anchors.forEach((link) => {
        const title = link.getAttribute("title") ?? "";
        if (title.includes("*favicon")) {
          link.setAttribute("title", title.replace(/\s*\*favicon\s*$/, "").trim());
          if (link.previousSibling instanceof HTMLImageElement) return;
          const url = link.href;
          const img = this.createFaviconImg(url);
          link.insertAdjacentElement("beforebegin", img);
        }
        if (title.includes("*thumbnail")) {
          link.setAttribute("title", link.getAttribute("title").replace(/\s*\*thumbnail\s*$/, "").trim());
          link.addEventListener("mouseenter", () => {
            const ipreview = document.createElement("div");
            ipreview.className = "iframe-hover-preview";
            ipreview.style.position = "absolute";
            ipreview.style.left = link.getBoundingClientRect().right + "px";
            ipreview.style.top = link.getBoundingClientRect().top + "px";
            ipreview.style.zIndex = "9999";
            ipreview.style.width = "400px";
            ipreview.style.height = "300px";
            ipreview.style.border = "1px solid #ccc";
            ipreview.style.background = "#fff";
            ipreview.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            ipreview.style.overflow = "hidden";
            const iframe = document.createElement("iframe");
            iframe.src = link.href;
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "none";
            ipreview.appendChild(iframe);
            document.body.appendChild(ipreview);
            link.addEventListener("mouseleave", () => {
              ipreview.remove();
            }, { once: true });
          });
        }
      });
    });
  }
  onunload() {
    console.log("Favicon plugin unloaded.");
  }
};
