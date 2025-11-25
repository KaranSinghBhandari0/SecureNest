export const dynamic = "force-dynamic";
import Header from "./@components/Header";
import { getCurrentUser } from "@/controllers/authController";
import { getNotifications } from "@/controllers/notificationController";

export default async function Navbar() {
  const user = await getCurrentUser();

  let notifications = [];
  if(user?._id) {
    notifications = await getNotifications(user._id);
  }

  return (
    <Header 
      user={user} 
      notifications={notifications} 
    />
  );
}
