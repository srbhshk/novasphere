import { redirect } from "next/navigation";

/**
 * Root page: redirects to the demo dashboard so the app opens directly there.
 */
export default function HomePage(): JSX.Element {
  redirect("/demo/dashboard");
}
