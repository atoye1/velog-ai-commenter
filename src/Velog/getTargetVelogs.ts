export function getTargetVelogs(): string[] {
  const targetBlogs = process.env.TARGET_VELOGS as string;
  return targetBlogs.split(",");
}
