import { getCurrentUser } from "@/controllers/authController";
import ProfileForm from "./ProfileForm";

export default async function Profile() {

  const user = await getCurrentUser();

  return (
    <ProfileForm user={user} />
  );
}
