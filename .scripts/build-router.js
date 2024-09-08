import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formatSegment = (segment, parentSegment) => {
  if (!segment) {
    return "";
  }

  if (segment[0] === "[") {
    const name =
      "By" +
      segment[1].toUpperCase() +
      segment.substring(2, segment.length - 1) +
      "Page";
    if (parentSegment) {
      return parentSegment[0].toUpperCase() + parentSegment.substring(1) + name;
    }

    return name;
  }

  return segment[0].toUpperCase() + segment.substring(1) + "Page";
};

const normalizePath = (path) => {
  if (path === "") {
    return {
      path: "/",
      fullPath: "",
      element: "<RootPage />",
    };
  }

  const segments = path.split("/");
  const self = segments.pop() ?? "";

  return {
    path: self[0] === "[" ? `:${self.substring(1, self.length - 1)}` : self,
    fullPath: path,
    element: `<${formatSegment(self, segments[segments.length - 1])} />`,
    parents: segments,
  };
};

const pages = globSync(`${__dirname}/../src/pages/**/page.tsx`)
  .map((path) =>
    path.substring(path.indexOf("/src/pages") + 10, path.length - 9)
  )
  .map(normalizePath);

const router = [];

for (const page of pages) {
  let currentLayer = router;

  if (page.parents) {
    for (const parent of page.parents) {
      let parentPage = currentLayer.find(
        (page) => page.path === (parent || "/")
      );

      if (!parentPage) {
        parentPage = {
          path: parent,
          children: [],
        };
        currentLayer.push(parentPage);
      }

      currentLayer = parentPage.children;
    }
  }

  currentLayer.push({
    path: page.path,
    element: page.element,
    children: [],
  });
}

let template = fs
  .readFileSync(`${__dirname}/../src/router.template`)
  .toString();

template = template.replace(
  "%IMPORTS%",
  pages
    .map(
      (page) =>
        `import ${page.element.substring(
          1,
          page.element.length - 3
        )} from "./pages/${page.fullPath.substring(1)}/page"`
    )
    .join("\n")
);
template = template.replace("%ROUTES%", JSON.stringify(router, null, 2));
template = template.replace(/"</g, "<");
template = template.replace(/\/>"/g, "/>");

fs.writeFileSync(`${__dirname}/../src/router.tsx`, template);
