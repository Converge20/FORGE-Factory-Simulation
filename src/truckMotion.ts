// Presentation motion only. Distances are scene units, not plant or vehicle specifications.
export const WHEEL_RADIUS = 0.52;
const smooth = (v: number) => {
  const t = Math.max(0, Math.min(1, v));
  return t * t * (3 - 2 * t);
};
function road(x: number) {
  return -2.2 * smooth((x - 4) / 18);
}
const samples = Array.from({ length: 201 }, (_, i) => {
  const x = i * 0.25;
  return { x, z: road(x), arc: 0 };
});
for (let i = 1; i < samples.length; i++)
  samples[i].arc =
    samples[i - 1].arc +
    Math.hypot(
      samples[i].x - samples[i - 1].x,
      samples[i].z - samples[i - 1].z,
    );
export function pointAtDistance(distance: number) {
  const d = Math.max(0, Math.min(distance, samples.at(-1)!.arc));
  let i = 1;
  while (i < samples.length - 1 && samples[i].arc < d) i++;
  const a = samples[i - 1],
    b = samples[i],
    u = (d - a.arc) / (b.arc - a.arc);
  const x = a.x + (b.x - a.x) * u,
    z = a.z + (b.z - a.z) * u;
  const dz = (road(x + 0.01) - road(x - 0.01)) / 0.02;
  const ddz = (road(x + 0.01) - 2 * road(x) + road(x - 0.01)) / 0.0001;
  return {
    x,
    z,
    yaw: -Math.atan2(dz, 1),
    steering: -Math.atan((3.8 * ddz) / Math.pow(1 + dz * dz, 1.5)),
  };
}
export function departureState(time: number, reduced = false) {
  const t = reduced ? 24 : Math.max(0, time);
  const u = Math.min(18, Math.max(0, t - 6));
  const distance = u <= 4 ? 0.25 * u * u : 4 + 2 * (u - 4);
  const p = pointAtDistance(distance),
    trailer = pointAtDistance(Math.max(0, distance - 4));
  return {
    ...p,
    distance,
    wheelAngle: -distance / WHEEL_RADIUS,
    trailerYaw: trailer.yaw - p.yaw,
    speed: reduced || t >= 24 || t < 6 ? 0 : u < 4 ? u * 0.5 : 2,
    closing: t >= 19,
    finished: t >= 24,
    follow: smooth((t - 6) / 4),
    dock: smooth((t - 2.5) / 3),
  };
}
