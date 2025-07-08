/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from "@babel/parser";
import MagicString from "magic-string";
import path from "path";
import type { Plugin } from "vite";

import type {
  TaggerPluginOptions,
  ComponentInfo,
  PluginStats,
  JSXAttributeMap,
} from "./types";
import {
  shouldTagElement,
  generateComponentId,
  shouldProcessFile,
} from "./utils";

const DEFAULT_OPTIONS: Required<TaggerPluginOptions> = {
  enabled: true,
  attributePrefix: "data-vite-tagger",
  includeLegacyAttributes: true,
  excludeElements: [],
  extensions: [".jsx", ".tsx"],
  includeContent: true,
};

export function createTaggerPlugin(options: TaggerPluginOptions = {}): Plugin {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const cwd = process.cwd();

  const stats: PluginStats = {
    totalFiles: 0,
    processedFiles: 0,
    totalElements: 0,
  };

  return {
    name: "vite-tagger",
    enforce: "pre",

    configResolved(resolvedConfig) {
      // Auto-enable in development if not explicitly set
      if (options.enabled === undefined) {
        config.enabled = resolvedConfig.command === "serve";
      }
    },

    async transform(code: string, id: string) {
      if (!config.enabled || !shouldProcessFile(id, config.extensions)) {
        return null;
      }

      stats.totalFiles++;
      const relativePath = path.relative(cwd, id);

      try {
        const result = await transformJSXCode(code, relativePath, config);

        if (result) {
          stats.processedFiles++;
          stats.totalElements += result.elementsCount;
          return {
            code: result.code,
            map: result.map,
          };
        }

        stats.processedFiles++;
        return null;
      } catch (error) {
        console.error(`Error processing file ${relativePath}:`, error);
        stats.processedFiles++;
        return null;
      }
    },

    buildEnd() {
      if (config.enabled && stats.totalFiles > 0) {
        console.log(
          `\n🏷️  Vite Tagger: Tagged ${stats.totalElements} elements in ${stats.processedFiles}/${stats.totalFiles} files`
        );
      }
    },
  };
}

async function transformJSXCode(
  code: string,
  relativePath: string,
  config: Required<TaggerPluginOptions>
) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  const magicString = new MagicString(code);
  let elementsCount = 0;
  let currentElement: any = null;

  const { walk } = await import("estree-walker");

  walk(ast as any, {
    enter(node: any) {
      if (node.type === "JSXElement") {
        currentElement = node;
      }

      if (node.type === "JSXOpeningElement") {
        const componentInfo = processJSXElement(
          node,
          currentElement,
          relativePath,
          config
        );

        if (componentInfo) {
          const attributes = generateAttributes(componentInfo, config);
          magicString.appendLeft(node.name.end ?? 0, attributes);
          elementsCount++;
        }
      }
    },
  });

  if (elementsCount === 0) {
    return null;
  }

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true }),
    elementsCount,
  };
}

function processJSXElement(
  jsxNode: any,
  currentElement: any,
  relativePath: string,
  config: Required<TaggerPluginOptions>
): ComponentInfo | null {
  let elementName: string;

  if (jsxNode.name.type === "JSXIdentifier") {
    elementName = jsxNode.name.name;
  } else if (jsxNode.name.type === "JSXMemberExpression") {
    const memberExpr = jsxNode.name;
    elementName = `${memberExpr.object.name}.${memberExpr.property.name}`;
  } else {
    return null;
  }

  // Skip Fragments
  if (elementName === "Fragment" || elementName === "React.Fragment") {
    return null;
  }

  // Check if element should be tagged
  if (!shouldTagElement(elementName, config.excludeElements)) {
    return null;
  }

  const line = jsxNode.loc?.start?.line ?? 0;
  const column = jsxNode.loc?.start?.column ?? 0;
  const fileName = path.basename(relativePath);

  const componentInfo: ComponentInfo = {
    elementName,
    relativePath,
    line,
    column,
    fileName,
  };

  if (config.includeContent) {
    componentInfo.content = extractElementContent(jsxNode, currentElement);
  }

  return componentInfo;
}

function extractElementContent(jsxNode: any, currentElement: any) {
  const attributes = extractAttributes(jsxNode);
  const content: ComponentInfo["content"] = {};

  // Extract text content
  if (currentElement?.children) {
    const textContent = currentElement.children
      .map((child: any) => {
        if (child.type === "JSXText") {
          return child.value.trim();
        } else if (child.type === "JSXExpressionContainer") {
          if (child.expression.type === "StringLiteral") {
            return child.expression.value;
          }
        }
        return "";
      })
      .filter(Boolean)
      .join(" ")
      .trim();

    if (textContent) {
      content.text = textContent;
    }
  }

  // Extract common attributes
  if (attributes.placeholder) {
    content.placeholder = attributes.placeholder;
  }

  if (attributes.className) {
    content.className = attributes.className;
  }

  return Object.keys(content).length > 0 ? content : undefined;
}

function extractAttributes(jsxNode: any): JSXAttributeMap {
  return jsxNode.attributes.reduce((acc: JSXAttributeMap, attr: any) => {
    if (attr.type === "JSXAttribute" && attr.name?.name) {
      if (attr.value?.type === "StringLiteral") {
        acc[attr.name.name] = attr.value.value;
      } else if (
        attr.value?.type === "JSXExpressionContainer" &&
        attr.value.expression.type === "StringLiteral"
      ) {
        acc[attr.name.name] = attr.value.expression.value;
      }
    }
    return acc;
  }, {});
}

function generateAttributes(
  componentInfo: ComponentInfo,
  config: Required<TaggerPluginOptions>
): string {
  const { attributePrefix } = config;
  const componentId = generateComponentId(
    componentInfo.relativePath,
    componentInfo.line,
    componentInfo.column
  );

  let attributes = ` ${attributePrefix}-id="${componentId}" ${attributePrefix}-name="${componentInfo.elementName}"`;

  // Add legacy attributes for compatibility
  if (config.includeLegacyAttributes) {
    const contentStr = componentInfo.content
      ? encodeURIComponent(JSON.stringify(componentInfo.content))
      : "";

    attributes += ` data-component-path="${componentInfo.relativePath}"`;
    attributes += ` data-component-line="${componentInfo.line}"`;
    attributes += ` data-component-file="${componentInfo.fileName}"`;
    attributes += ` data-component-name="${componentInfo.elementName}"`;

    if (contentStr) {
      attributes += ` data-component-content="${contentStr}"`;
    }
  }

  return attributes;
}
