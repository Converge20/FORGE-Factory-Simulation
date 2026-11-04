import type { Vec3 } from "./process";
import { chapters } from "./story";
export const layout: {
  chapter: number;
  zone: string;
  position: Vec3;
  focus: Vec3;
  radius: number;
}[] = [
  {
    chapter: 1,
    zone: "Can manufacturing",
    position: [-17, 0, 4],
    focus: [-17, 1.5, 4],
    radius: 4.2,
  },
  {
    chapter: 2,
    zone: "Can preparation & decoration",
    position: [-9, 0, 4],
    focus: [-9, 1.5, 4],
    radius: 4.1,
  },
  {
    chapter: 3,
    zone: "Water & ingredient preparation",
    position: [-16, 0, -7],
    focus: [-16, 1.5, -7],
    radius: 3.4,
  },
  {
    chapter: 4,
    zone: "Water & ingredient preparation",
    position: [-9, 0, -7],
    focus: [-9, 1.6, -7],
    radius: 3.4,
  },
  {
    chapter: 5,
    zone: "Water & ingredient preparation",
    position: [-2, 0, -7],
    focus: [-2, 1.5, -7],
    radius: 3.2,
  },
  {
    chapter: 6,
    zone: "Blending & beverage preparation",
    position: [5, 0, -7],
    focus: [5, 1.7, -7],
    radius: 3.2,
  },
  {
    chapter: 7,
    zone: "Blending & beverage preparation",
    position: [12, 0, -7],
    focus: [12, 1.7, -7],
    radius: 3.2,
  },
  {
    chapter: 8,
    zone: "Filling & sealing",
    position: [0, 0, 4],
    focus: [0, 1.6, 4],
    radius: 4,
  },
  {
    chapter: 9,
    zone: "Filling & sealing",
    position: [7, 0, 4],
    focus: [7, 1.5, 4],
    radius: 3,
  },
  {
    chapter: 10,
    zone: "Quality inspection",
    position: [14, 0, 4],
    focus: [14, 1.5, 4],
    radius: 4,
  },
  {
    chapter: 11,
    zone: "Packaging & logistics",
    position: [14, 0, 12],
    focus: [14, 1.7, 12],
    radius: 4.2,
  },
  {
    chapter: 12,
    zone: "Packaging & logistics",
    position: [5, 0, 12],
    focus: [5, 1.43, 12],
    radius: 4.4,
  },
  {
    chapter: 13,
    zone: "Shipping & loading",
    position: [-3, 0, 21],
    focus: [-4, 1.6, 21],
    radius: 10,
  },
];
export const explorerStations = layout.map((s) => ({
  ...s,
  id: chapters[s.chapter].id,
  title: chapters[s.chapter].subtitle.replace(/^\d+ \/ /, ""),
  content: chapters[s.chapter],
  evidence:
    "Red Bull information / industry practice / illustrative reconstruction",
  animation: { demoIndex: s.chapter, selected: true },
}));
export const overview = {
  eye: [53, 43, 59] as Vec3,
  target: [0, 0.8, 3] as Vec3,
};
export const canRoute: Vec3[] = [
  [-15, 1.53, 4],
  [-9, 1.53, 4],
  [0, 1.53, 4],
  [7, 1.53, 4],
  [18.5, 1.53, 4],
  [18.5, 1.53, 12],
  [14, 1.53, 12],
];
export const packRoute: Vec3[] = [
  [14, 1.43, 12],
  [5, 1.43, 12],
  [-15, 1.43, 12],
  [-15, 1.43, 19],
];
export function routePoint(points: Vec3[], progress: number): Vec3 {
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(...p.map((v, j) => v - points[i][j])));
  let d = (((progress % 1) + 1) % 1) * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (d <= lengths[i])
      return points[i].map(
        (v, j) => v + ((points[i + 1][j] - v) * d) / lengths[i],
      ) as Vec3;
    d -= lengths[i];
  }
  return points[0];
}
