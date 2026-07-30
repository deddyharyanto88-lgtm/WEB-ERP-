export async function signIn(
  credentials: { entity: string; username: string; password: string }
): Promise<{ success: boolean; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (!credentials.username || !credentials.password) {
    return { success: false, error: "Please enter both username and password" };
  }
  return { success: true };
}
