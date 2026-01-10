import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchUser } from '@/actions/ServerSideFetching';
import UserDashboard from "./UserDashboard"; // Import the new client component

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Ensure session and user ID exist before fetching
  if (!session?.user?.userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500 py-20">
          Authentication error. Please log in again.
        </div>
      </div>
    );
  }
  
  const userId = session.user.userId;
  const userEmail = session.user.email as string;
  const currentUser = await fetchUser(userId, userEmail);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500 py-20">
          Unable to load user details. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* == Sidebar Navigation (Client Component) == */}
          <div className="lg:col-span-3 xl:col-span-3 mb-8 lg:mb-0">
            <UserDashboard user={currentUser} userId={userId} />
          </div>

          {/* == Main Content Area == */}
          <main className="lg:col-span-9 xl:col-span-9">
            <div className="bg-white p-1 md:p-6 sm:p-8 rounded-2xl shadow-sm min-h-[400px]">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}