/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 可以添加自定义颜色
      },
      animation: {
        // 可以添加自定义动画
      },
    },
  },
  plugins: [],
  // 确保 Tailwind 可以覆盖 Ant Design 的样式
  important: true,
} 