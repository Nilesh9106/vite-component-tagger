export interface TaggerPluginOptions {
  /**
   * Whether to enable the plugin (default: true in development, false in production)
   */
  enabled?: boolean;

  /**
   * Custom attribute prefix (default: 'data-vite-tagger')
   */
  attributePrefix?: string;

  /**
   * Whether to include legacy data attributes for compatibility
   */
  includeLegacyAttributes?: boolean;

  /**
   * Custom elements to exclude from tagging
   */
  excludeElements?: string[];

  /**
   * File extensions to process (default: ['.jsx', '.tsx'])
   */
  extensions?: string[];

  /**
   * Whether to include detailed content information
   */
  includeContent?: boolean;
}

export interface ComponentInfo {
  elementName: string;
  relativePath: string;
  line: number;
  column: number;
  fileName: string;
  content?: {
    text?: string;
    placeholder?: string;
    className?: string;
  };
}

export interface PluginStats {
  totalFiles: number;
  processedFiles: number;
  totalElements: number;
}

export interface JSXAttributeMap {
  [key: string]: string;
}
