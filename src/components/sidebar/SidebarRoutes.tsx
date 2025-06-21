// import {  ChartSpline, Layout,  NotebookPen,  User, Users } from "lucide-react";
// import SidebarItem from "./SidebarItem";
// import { useLocation } from "react-router-dom";

// const guestRoutes = [
//   { icon: Layout, label: "Dashboard", href: "/dashboard" },
//   { icon: User, label: "Profile", href: "/dashboard/profile" },
// ];

// const teacherRoutes = [
//   { icon: Users, label: "Students", href: "/admin" },
//   { icon: ChartSpline, label: "Analytics", href: "/admin/analytics" },
//   { icon: NotebookPen, label: "Exams", href: "/admin/exams" },
// ];

// const SidebarRoutes = () => {
//   const location = useLocation();
//   const isTeacherPage = location.pathname.includes("/admin");

//   const routes = isTeacherPage ? teacherRoutes : guestRoutes;

//   return (
//     <div className="flex flex-col w-full">
//       {routes.map((route) => (
//         <SidebarItem
//           key={route.href}
//           icon={route.icon}
//           label={route.label}
//           href={route.href}
//         />
//       ))}
//     </div>
//   );
// };

// export default SidebarRoutes;
