export function getRequiredEnv(name: string, fallbackNames: string[] = []) {
  const namesToCheck = [name, ...fallbackNames];

  for (const candidate of namesToCheck) {
    const value = process.env[candidate];
    if (value) {
      return value;
    }
  }

  throw new Error(
    `Missing required environment variable. Set one of: ${namesToCheck.join(", ")}`
  );
}
