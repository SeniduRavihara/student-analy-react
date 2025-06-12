// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// // Custom icons using SVGs for a unique physics theme
// const PhysicsIcons = {
//   Dashboard: () => (
//     <svg
//       width="22"
//       height="22"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M3 11L12 2L21 11V22H3V11Z"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   ),
//   Profile: () => (
//     <svg
//       width="22"
//       height="22"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
//       <path
//         d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   ),
//   Students: () => (
//     <svg
//       width="22"
//       height="22"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
//       <path
//         d="M3 19C3 16.2386 5.23858 14 8 14H10C12.7614 14 15 16.2386 15 19"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//       <circle cx="17" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
//       <path
//         d="M15 15C15 14 16.5 13 18.5 13C20.5 13 22 14 22 15V18H15V15Z"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   ),
//   Analytics: () => (
//     <svg
//       width="22"
//       height="22"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M3 12H7L10 7L14 17L17 12H21"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M3 3V21H21"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   ),
//   Exams: () => (
//     <svg
//       width="22"
//       height="22"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M4 4V20H20V4H4Z"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M4 8H20"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//       <path
//         d="M10 12H16"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//       <path
//         d="M10 16H16"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//       <path
//         d="M7 12H8"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//       <path
//         d="M7 16H8"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   ),
//   Atom: () => (
//     <svg
//       width="40"
//       height="40"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <circle cx="12" cy="12" r="2" fill="currentColor" />
//       <ellipse
//         cx="12"
//         cy="12"
//         rx="10"
//         ry="4.5"
//         stroke="currentColor"
//         strokeWidth="2"
//         transform="rotate(0)"
//       />
//       <ellipse
//         cx="12"
//         cy="12"
//         rx="10"
//         ry="4.5"
//         stroke="currentColor"
//         strokeWidth="2"
//         transform="rotate(60 12 12)"
//       />
//       <ellipse
//         cx="12"
//         cy="12"
//         rx="10"
//         ry="4.5"
//         stroke="currentColor"
//         strokeWidth="2"
//         transform="rotate(120 12 12)"
//       />
//     </svg>
//   ),
// };

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const guestRoutes = [
//     { icon: PhysicsIcons.Dashboard, label: "Dashboard", href: "/dashboard" },
//     {
//       icon: PhysicsIcons.Profile,
//       label: "Profile",
//       href: "/dashboard/profile",
//     },
//   ];

//   const teacherRoutes = [
//     { icon: PhysicsIcons.Students, label: "Students", href: "/admin" },
//     {
//       icon: PhysicsIcons.Analytics,
//       label: "Analytics",
//       href: "/admin/analytics",
//     },
//     { icon: PhysicsIcons.Exams, label: "Exams", href: "/admin/exams" },
//   ];

//   const isTeacherPage = location.pathname.includes("/admin");
//   const routes = isTeacherPage ? teacherRoutes : guestRoutes;

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div
//       className={`h-full flex flex-col transition-all duration-300 ${
//         isCollapsed ? "w-20" : "w-64"
//       } bg-gradient-to-b from-white to-blue-50 shadow-lg relative`}
//     >
//       {/* Toggle button */}
//       <button
//         onClick={toggleCollapse}
//         className="absolute -right-3 top-24 bg-white rounded-full p-1 shadow-md z-10 hover:bg-blue-50"
//       >
//         <svg
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d={isCollapsed ? "M8 4l8 8-8 8" : "M16 4l-8 8 8 8"}
//             stroke="#3B82F6"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </button>

//       {/* Logo section */}
//       <div
//         className={`py-6 flex items-center justify-center transition-all duration-300 ${
//           isCollapsed ? "px-2" : "px-4"
//         }`}
//       >
//         <div
//           className="cursor-pointer flex items-center justify-center"
//           onClick={() => navigate("/")}
//         >
//           <div className="text-blue-600">
//             <PhysicsIcons.Atom />
//           </div>
//           {!isCollapsed && (
//             <span className="ml-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
//               PHY6LK
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Physics-themed decorative element */}
//       <div className="px-6 mb-4">
//         <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
//       </div>

//       {/* Navigation Items */}
//       <div className="flex flex-col w-full px-2 space-y-1">
//         {routes.map((route) => {
//           const isActive =
//             location.pathname === route.href ||
//             location.pathname.startsWith(`${route.href}/`);

//           return (
//             <button
//               key={route.href}
//               onClick={() => navigate(route.href)}
//               className={`
//                 flex items-center rounded-xl px-3 py-3
//                 ${isCollapsed ? "justify-center" : "justify-start"}
//                 transition-all duration-200
//                 ${
//                   isActive
//                     ? "bg-blue-100 text-blue-700 shadow-sm"
//                     : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
//                 }
//               `}
//             >
//               <div
//                 className={`${isActive ? "text-blue-600" : "text-gray-500"}`}
//               >
//                 <route.icon />
//               </div>

//               {!isCollapsed && (
//                 <span
//                   className={`ml-3 font-medium ${
//                     isActive ? "text-blue-700" : ""
//                   }`}
//                 >
//                   {route.label}
//                 </span>
//               )}

//               {!isCollapsed && isActive && (
//                 <div className="ml-auto">
//                   <div className="h-2 w-2 rounded-full bg-blue-600"></div>
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* Bottom decorative physics formula */}
//       <div className="mt-auto pb-4 px-4">
//         <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-4"></div>
//         {!isCollapsed && (
//           <div className="text-center text-gray-500 text-xs font-mono">
//             E = mc²
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
