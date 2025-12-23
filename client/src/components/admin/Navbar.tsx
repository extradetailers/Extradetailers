import useUser from "@/hooks/useUser";
import { EUserRole, IMenuItem } from "@/types";
import { adminMenuList } from "@/utils/staticData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface INavbarProps {
  className: string;
  title: string;
  menuList: IMenuItem[];
}

function Navbar({ className, title, menuList }: INavbarProps) {
  const pathname = usePathname();
  const user = useUser();

  return (
    <nav
      className={`d-flex flex-column bg-dark text-white p-2 p-md-3 rounded ${className}`}
    >
      {title && <h4 className="mb-3 mb-md-4">{title}</h4>}

      {/* user?.userRole === EUserRole.DETAILER &&
            item.title !== "Checkout" && */}

      <ul className="nav nav-pills flex-column mb-auto overflow-auto">
        {menuList.map(
          (item) => (
              <li key={item.title} className="nav-item mb-1">
                <div className="d-flex align-items-center justify-content-between">
                  <Link
                    href={item.path}
                    className={`nav-link flex-grow-1 text-truncate ${
                      pathname === item.path
                        ? "active bg-primary"
                        : "text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                </div>

                {/* Sub-menu rendering if current path is under service */}
                {item.children && pathname.includes(item.path) && (
                  <ul className="nav flex-column mt-2 ms-3 border-start border-secondary ps-2">
                    {item.children.map((subItem) => (
                      <li key={subItem.title} className="nav-item">
                        <Link
                          href={subItem.path}
                          className={`nav-link text-truncate ${
                            pathname === subItem.path
                              ? "active bg-primary"
                              : "text-white"
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
