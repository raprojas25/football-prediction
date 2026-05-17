import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <nav className="flex justify-between  max-w-full padding-container relative z-30 py-5">
      <Link to="/">
        <img src="/hilink-logo.svg" alt="logo" width={74} height={29} />
      </Link>

      <ul className="h-full gap-12 lg:flex">
        {[
          { href: "/", key: "home", label: "Home" },
          { href: "/", key: "how_hilink_work", label: "How Hilink Work?" },
          { href: "/", key: "services", label: "Services" },
          { href: "/", key: "pricing ", label: "Pricing " },
          { href: "/", key: "contact_us", label: "Contact Us" },
        ].map((link) => (
          <Link
            to={link.href}
            key={link.key}
            className="text-sm text-gray-50 justify-center cursor-pointer pb-1.5 transition-all hover:font-bold"
          >
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="lg:flex justify-center hidden">
        <button type="button">Login</button>
      </div>

      <img
        src="menu.svg"
        alt="menu"
        width={32}
        height={32}
        className="inline-block cursor-pointer lg:hidden"
      />
    </nav>
  );
};
