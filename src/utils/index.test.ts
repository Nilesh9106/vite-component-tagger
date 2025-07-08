import { describe, it, expect } from "vitest";
import {
  shouldTagElement,
  generateComponentId,
  shouldProcessFile,
} from "./index";

describe("shouldTagElement", () => {
  it("should tag regular HTML elements", () => {
    expect(shouldTagElement("div")).toBe(true);
    expect(shouldTagElement("button")).toBe(true);
    expect(shouldTagElement("input")).toBe(true);
  });

  it("should not tag Three.js Fiber elements", () => {
    expect(shouldTagElement("mesh")).toBe(false);
    expect(shouldTagElement("bufferGeometry")).toBe(false);
    expect(shouldTagElement("material")).toBe(false);
  });

  it("should not tag Drei elements", () => {
    expect(shouldTagElement("OrbitControls")).toBe(false);
    expect(shouldTagElement("Environment")).toBe(false);
    expect(shouldTagElement("Text3D")).toBe(false);
  });

  it("should respect custom exclusions", () => {
    expect(shouldTagElement("MyComponent", ["MyComponent"])).toBe(false);
    expect(shouldTagElement("AnotherComponent", ["MyComponent"])).toBe(true);
  });
});

describe("generateComponentId", () => {
  it("should generate correct component ID format", () => {
    const result = generateComponentId("src/components/Button.tsx", 10, 5);
    expect(result).toBe("src/components/Button.tsx:10:5");
  });
});

describe("shouldProcessFile", () => {
  it("should process JSX/TSX files", () => {
    expect(shouldProcessFile("Button.jsx", [".jsx", ".tsx"])).toBe(true);
    expect(shouldProcessFile("Button.tsx", [".jsx", ".tsx"])).toBe(true);
  });

  it("should not process other file types", () => {
    expect(shouldProcessFile("Button.js", [".jsx", ".tsx"])).toBe(false);
    expect(shouldProcessFile("Button.css", [".jsx", ".tsx"])).toBe(false);
  });

  it("should not process node_modules files", () => {
    expect(
      shouldProcessFile("node_modules/package/Button.jsx", [".jsx", ".tsx"])
    ).toBe(false);
  });
});
