export function getTargetVelogs(targets: string): string[] {
  if (!targets) {
    throw new Error("No target Blogs provided!");
  }
  return targets.split(",");
}
