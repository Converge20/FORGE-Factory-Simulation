// Illustrative presentation timing only; no plant throughput or dosing settings.
export const wrap = (n: number, length: number) =>
  ((n % length) + length) % length;
export const smooth = (n: number) => {
  const x = Math.max(0, Math.min(1, n));
  return x * x * (3 - 2 * x);
};
export const BELT_TOP = 1.09;
export const FILL_CYCLE = 6;
export function fillingState(time: number, lane: number) {
  const cycle = Math.floor(time / FILL_CYCLE),
    phase = wrap(time, FILL_CYCLE);
  const travel = 3 * (cycle + smooth(phase / 1.5));
  const startX = wrap(lane - 3 + 3 * cycle + 3.5, 7) - 3.5;
  const x = wrap(lane - 3 + travel + 3.5, 7) - 3.5;
  const moving = phase < 1.5;
  const filling = phase >= 1.9 && phase < 4.5;
  // Outgoing cans retain their contents during indexing; reset occurs inside the end guard.
  const fill = moving
    ? startX >= -1.5 && startX + 3 * smooth(phase / 1.5) < 3.5
      ? 1
      : 0
    : x < -1.5
      ? 0
      : x > 1.5
        ? 1
        : smooth((phase - 1.9) / 2.6);
  return {
    x,
    fill,
    moving,
    filling,
    valve: smooth((phase - 1.5) / 0.35) * (1 - smooth((phase - 4.65) / 0.5)),
    phase,
  };
}
export function sealingState(time: number, lane: number) {
  const cycle = Math.floor(time / 4),
    phase = wrap(time, 4);
  const startX = wrap(lane - 3 + cycle + 3.5, 7) - 3.5;
  const x = wrap(lane - 3 + cycle + smooth(phase / 1.1) + 3.5, 7) - 3.5;
  const sealed =
    phase < 1.1 ? startX >= 0 && x >= 0 : x >= 0 && (x > 0.1 || phase >= 2.85);
  return {
    x,
    phase,
    sealed,
    endDrop: smooth((phase - 1.25) / 0.7),
    engagement:
      smooth((phase - 1.95) / 0.35) * (1 - smooth((phase - 2.85) / 0.4)),
  };
}
export function packagingState(time: number) {
  const p = wrap(time, 10),
    pickup = -1.6,
    destination = 1.55;
  const carryX = pickup + (destination - pickup) * smooth((p - 3.3) / 1.7);
  const cartonX = destination + 3.1 * smooth((p - 7.5) / 2.5);
  const packX =
    p < 1.8
      ? -4.5 + 2.9 * smooth(p / 1.8)
      : p < 3.3
        ? pickup
        : p < 7.5
          ? carryX
          : cartonX;
  const packY =
    BELT_TOP + 1.25 * smooth((p - 2.5) / 0.8) - 1.2 * smooth((p - 5) / 1);
  const toolY =
    p < 2.5
      ? 3.05 - 1.35 * smooth((p - 1.8) / 0.7)
      : p < 6
        ? packY + 0.61
        : 1.75 + 1.3 * smooth((p - 6) / 0.7);
  return {
    phase: p,
    packX,
    packY,
    cartonX,
    cartonZ: -4.2 * (1 - smooth(p / 1.8)),
    toolX: p < 3.3 ? pickup : carryX,
    toolY,
    open: 1 - smooth((p - 6.8) / 0.6),
    attached: p >= 2.5 && p < 6,
  };
}
export function inspectionState(time: number, lane: number) {
  const x = wrap(time * 0.65 + lane * 1.4, 7) - 3.5;
  const rejected = lane === 3;
  const z = rejected ? 2 * smooth((x - 0.65) / 1.6) : 0;
  return { x, z, rejected, rejecting: rejected && x > 0.65 && x < 2.25 };
}
export interface FlowClock {
  time: number;
}
export function advanceFlow(
  clock: FlowClock,
  delta: number,
  paused: boolean,
  reduced: boolean,
) {
  if (!paused && !reduced) clock.time += Math.min(Math.max(delta, 0), 1);
  return reduced ? 16 : clock.time;
}
