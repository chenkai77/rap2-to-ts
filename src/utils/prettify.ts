import { format as prettify } from "prettier";

// 格式化代码
export function formatCode(code: string): string {
  return prettify(code, {
    parser: "typescript",
    singleQuote: true,
    semi: false,
  });
}

// 格式化代码
export function formatJsonCode(code: string): string {
  return prettify(code, {
    parser: "json",
    singleQuote: true,
    semi: false,
  });
}
