const CATEGORY_COLORS = {
  "All Tasks": {
    accent: "#111827",
    soft: "#eeeeea",
    text: "#111827",
    shadow: "rgba(17, 24, 39, 0.12)",
  },
  Work: {
    accent: "#3f6fb5",
    soft: "#edf3fb",
    text: "#294f86",
    shadow: "rgba(63, 111, 181, 0.14)",
  },
  Home: {
    accent: "#4d8b68",
    soft: "#eef7f1",
    text: "#326346",
    shadow: "rgba(77, 139, 104, 0.14)",
  },
  Gym: {
    accent: "#bd6b4f",
    soft: "#fbf0eb",
    text: "#874630",
    shadow: "rgba(189, 107, 79, 0.15)",
  },
};

const FALLBACK_COLORS = [
  {
    accent: "#a85d87",
    soft: "#f8eef4",
    text: "#76415f",
    shadow: "rgba(168, 93, 135, 0.14)",
  },
  {
    accent: "#7a68a7",
    soft: "#f1eef8",
    text: "#57487f",
    shadow: "rgba(122, 104, 167, 0.14)",
  },
  {
    accent: "#4f8a93",
    soft: "#edf7f8",
    text: "#35636a",
    shadow: "rgba(79, 138, 147, 0.14)",
  },
  {
    accent: "#9f7a32",
    soft: "#f7f1e3",
    text: "#705721",
    shadow: "rgba(159, 122, 50, 0.14)",
  },
];

function getFallbackIndex(category) {
  return [...category].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    FALLBACK_COLORS.length;
}

export function getCategoryColors(category = "All Tasks") {
  return CATEGORY_COLORS[category] || FALLBACK_COLORS[getFallbackIndex(category)];
}

export function getCategoryStyle(category) {
  const colors = getCategoryColors(category);

  return {
    "--category-accent": colors.accent,
    "--category-soft": colors.soft,
    "--category-text": colors.text,
    "--category-shadow": colors.shadow,
  };
}
