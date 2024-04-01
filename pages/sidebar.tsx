import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { RiSettings3Line } from "react-icons/ri";
import { FiMapPin } from "react-icons/fi";
import { MdHelpOutline } from 'react-icons/md';
import { AiOutlineLogout } from "react-icons/ai"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { useRouter } from "next/router";


const sidebarItems = [
  {
    name: "Home Page",
    href: "/",
    icon: AiOutlineHome,
  },
  {
    name: "Friends",
    href: "/friends",
    icon: BsPeople,
  },
  {
    name: "Trips",
    href: "/trips",
    icon: FiMapPin,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: RiSettings3Line,
  },
  {
    name: "Help",
    href: "/help",
    icon: MdHelpOutline,
  },
  {
    name: "Logout",
    href: "/logout",
    icon: AiOutlineLogout,
  }
];

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebarcollapse: () => void;
}

const Sidebar = () => {
  const router = useRouter();
  const { isCollapsed, toggleSidebarcollapse } = useContext(SidebarContext) as SidebarContextType;

  return (
    <div className="sidebar__wrapper">
      <button className="btn" onClick={toggleSidebarcollapse}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>
      <aside className="sidebar" data-collapse={isCollapsed}>
        <div className="sidebar__top">
          <Image
            width={80}
            height={80}
            className="sidebar__logo"
            src="/logo.jpg"
            alt="logo"
          />
          <p className="sidebar__logo-name">Your name</p>
        </div>
        <ul className="sidebar__list">
          {sidebarItems.map(({ name, href, icon: Icon }) => {
            return (
              <li className="sidebar__item" key={name}>
                <Link
                  className={`sidebar__link ${
                    router.pathname === href ? "sidebar__link--active" : ""
                  }`}
                  href={href}
                >
                  <span className="sidebar__icon">
                    <Icon />
                  </span>
                  <span className="sidebar__name">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;