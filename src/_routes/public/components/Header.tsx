
const Header = () => (
  <header className="bg-blue-700 text-white py-4 px-6 flex justify-between items-center">
    <div className="text-xl font-bold">EduAnalytics</div>
    <nav className="space-x-4">
      <a href="/" className="hover:underline">
        Home
      </a>
      <a href="/dashboard" className="hover:underline">
        Dashboard
      </a>
      <a href="/profile" className="hover:underline">
        Profile
      </a>
    </nav>
  </header>
);

export default Header;
