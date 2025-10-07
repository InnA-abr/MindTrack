export default function isJSON(str) {
  try {
    const obj = JSON.parse(str);
    return obj && typeof obj === "object" && obj !== null;
  } catch {
    return false;
  }
}
