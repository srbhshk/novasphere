import type React from "react";
import { redirect } from "next/navigation";

/**
 * Root page: redirects to the demo dashboard so the app opens directly there.
 */
export default function HomePage(): React.ReactElement {
  redirect("/demo/dashboard");
}
