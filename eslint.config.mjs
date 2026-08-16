import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // ตัวอย่าง: ปิดแจ้งเตือนเมื่อใช้ type any
      "@typescript-eslint/no-unused-vars": "warn", // ตัวอย่าง: ปรับตัวแปรที่ไม่ได้ใช้เป็นแค่ warning
      "react-hooks/exhaustive-deps": "warn",      // ตัวอย่าง: เตือน dependency ของ useEffect
      "react/no-children-prop": [
        true,
        {
          "allowFunctions": true
        }
      ],
    },
  },
]);

export default eslintConfig;
