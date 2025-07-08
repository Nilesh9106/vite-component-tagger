# Vite Component Tagger

A Vite plugin that automatically tags JSX/TSX elements with component details for development and debugging purposes.

## Features

- 🏷️ **Automatic Tagging**: Adds data attributes to JSX/TSX elements with file path, line number, and component information
- 🎯 **Smart Filtering**: Automatically excludes Three.js Fiber and Drei components from tagging
- ⚡ **Zero Config**: Works out of the box with sensible defaults
- 🔧 **Highly Configurable**: Customize attribute prefixes, exclusions, and more
- 📦 **TypeScript Ready**: Full TypeScript support with proper type definitions
- 🚀 **Development Focused**: Automatically enables in development, disables in production

## Installation

```bash
# Using pnpm
pnpm add -D vite-component-tagger

# Using npm
npm install -D vite-component-tagger

# Using yarn
yarn add -D vite-component-tagger
```

## Usage

### Basic Setup

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { createTaggerPlugin } from "vite-component-tagger";

export default defineConfig({
  plugins: [
    createTaggerPlugin(),
    // ... other plugins
  ],
});
```

### With Options

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { createTaggerPlugin } from "vite-component-tagger";

export default defineConfig({
  plugins: [
    createTaggerPlugin({
      enabled: true, // Force enable/disable
      attributePrefix: "data-my-tagger", // Custom prefix
      excludeElements: ["MyCustomComponent"], // Additional exclusions
      includeContent: true, // Include text content and attributes
      includeLegacyAttributes: true, // Include legacy data-component-* attributes
    }),
  ],
});
```

## Output Example

### Input JSX

```jsx
function MyComponent() {
  return (
    <div className="container">
      <button onClick={handleClick}>Click me</button>
      <input placeholder="Enter text" />
    </div>
  );
}
```

### Output JSX (Development)

```jsx
function MyComponent() {
  return (
    <div
      className="container"
      data-vite-tagger-id="src/components/MyComponent.tsx:3:4"
      data-vite-tagger-name="div"
      data-component-path="src/components/MyComponent.tsx"
      data-component-line="3"
      data-component-file="MyComponent.tsx"
      data-component-name="div"
      data-component-content="%7B%22className%22%3A%22container%22%7D"
    >
      <button
        onClick={handleClick}
        data-vite-tagger-id="src/components/MyComponent.tsx:4:6"
        data-vite-tagger-name="button"
        data-component-path="src/components/MyComponent.tsx"
        data-component-line="4"
        data-component-file="MyComponent.tsx"
        data-component-name="button"
        data-component-content="%7B%22text%22%3A%22Click%20me%22%7D"
      >
        Click me
      </button>
      <input
        placeholder="Enter text"
        data-vite-tagger-id="src/components/MyComponent.tsx:5:6"
        data-vite-tagger-name="input"
        data-component-path="src/components/MyComponent.tsx"
        data-component-line="5"
        data-component-file="MyComponent.tsx"
        data-component-name="input"
        data-component-content="%7B%22placeholder%22%3A%22Enter%20text%22%7D"
      />
    </div>
  );
}
```

## Configuration Options

| Option                    | Type       | Default                        | Description                                  |
| ------------------------- | ---------- | ------------------------------ | -------------------------------------------- |
| `enabled`                 | `boolean`  | `true` in dev, `false` in prod | Whether to enable the plugin                 |
| `attributePrefix`         | `string`   | `'data-vite-tagger'`           | Prefix for data attributes                   |
| `includeLegacyAttributes` | `boolean`  | `true`                         | Include legacy `data-component-*` attributes |
| `excludeElements`         | `string[]` | `[]`                           | Additional elements to exclude from tagging  |
| `extensions`              | `string[]` | `['.jsx', '.tsx']`             | File extensions to process                   |
| `includeContent`          | `boolean`  | `true`                         | Include element content information          |

## Excluded Elements

The plugin automatically excludes the following elements from tagging:

- **React Fragments**: `Fragment`, `React.Fragment`
- **Three.js Fiber Elements**: `mesh`, `geometry`, `material`, etc.
- **Drei Components**: `OrbitControls`, `Environment`, `Text`, etc.

## Use Cases

### Development Debugging

Quickly identify which file and line contains a specific element in your browser's dev tools.

### Component Documentation

Generate automatic component maps for documentation purposes.

### E2E Testing

Use the data attributes for more reliable element selection in tests.

### Design System Debugging

Track component usage across your application.

## Browser Usage

Once tagged, you can easily find component information in your browser:

```javascript
// Find elements by component name
document.querySelectorAll('[data-vite-tagger-name="Button"]');

// Get component info for an element
const element = document.querySelector(".my-element");
const componentInfo = {
  id: element.getAttribute("data-vite-tagger-id"),
  name: element.getAttribute("data-vite-tagger-name"),
  path: element.getAttribute("data-component-path"),
  line: element.getAttribute("data-component-line"),
};
```

## TypeScript Support

The plugin includes full TypeScript definitions:

```typescript
import type { TaggerPluginOptions } from "vite-component-tagger";

const options: TaggerPluginOptions = {
  enabled: true,
  attributePrefix: "data-my-prefix",
};
```

## Links

- **npm Package**: https://www.npmjs.com/package/vite-component-tagger
- **GitHub Repository**: https://github.com/Nilesh9106/vite-component-tagger
- **Issues**: https://github.com/Nilesh9106/vite-component-tagger/issues

## License

MIT

## Author

Created by [Nilesh Darji](https://github.com/Nilesh9106)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
