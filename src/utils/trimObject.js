export const trimObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.trim()];
      } else if (Array.isArray(value)) {
        // recursively trim arrays
        return [key, value.map(v => (typeof v === "string" ? v.trim() : v))];
      } else if (typeof value === "object" && value !== null) {
        // recursively trim nested objects
        return [key, trimObject(value)];
      }
      return [key, value];
    })
  );
};
