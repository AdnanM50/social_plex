import { redirect } from "next/navigation"
import { getCurrentUser } from "@/src/lib/auth"

export default async function HomePage() {
  const user = await getCurrentUser()

  if (user) {
    redirect(`/profile/${user._id}`)
  } else {
    redirect("/login")
  }
}
