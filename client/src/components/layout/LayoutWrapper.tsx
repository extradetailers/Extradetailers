"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Navbar from "../admin/Navbar";
import UserMenu from "../admin/UserMenu";
import { IMenuItem, TModuleStyle } from "@/types";
import { IoClose, IoOpen } from "react-icons/io5";
import { CiMenuBurger } from "react-icons/ci";

interface ILayoutWrapperProps extends React.PropsWithChildren {
  title: string;
  menuList: IMenuItem[];
  styles: TModuleStyle;
}

function LayoutWrapper({
  children,
  title,
  styles,
  menuList,
}: ILayoutWrapperProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className={`vh-100 d-flex flex-nowrap ${isOpen ? "overflow-hidden" : ""}`}>
      {/* Sidebar - Collapsible on mobile */}
      <div
        className={`${styles.leftSide} d-flex flex-column flex-shrink-0 p-3 text-bg-dark`}
        style={{
          width: isOpen ? "280px" : "60px",
          transition: "width 0.3s ease",
        }}
      >
        {/* Sidebar toggler */}
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="navbar-toggler border text-white w-100 my-2"
            type="button"
          >
            <CiMenuBurger size={24} />
          </button>
        ) : (
          <React.Fragment>
            <div className="d-flex justify-content-between align-items-center">
              <Link
                href="/"
                className="d-flex align-items-center mb-3 px-3 mb-md-0 me-md-auto text-white text-decoration-none"
              >
                <Image
                  height={50}
                  width={50}
                  src="/logo.png"
                  alt="Extradetailer-logo"
                  className="img-fluid"
                />
                <span className="ms-2 d-none d-md-inline">ExtraDetailer</span>
              </Link>
              {/* Close button for mobile */}
              <button
                className="d-md-none bg-transparent border-0 text-white"
                onClick={() => setIsOpen(false)}
              >
                <IoClose size={20} />
              </button>
            </div>
            <hr className="my-2" />
            <div className="flex-grow-1 overflow-hidden d-flex flex-column">
              <Navbar className="overflow-y-auto" title={isOpen ? title : ''} menuList={menuList} />
              <hr className="my-2" />
              <UserMenu />
            </div>
          </React.Fragment>
        )}
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 end-0 bottom-0 z-1 d-md-none bg-dark opacity-50"
          onClick={() => setIsOpen(false)}
          style={{ zIndex: 1000 }}
        />
      )}

      {/* Main content area */}
      <div className="flex-grow-1 d-flex flex-column overflow-auto">
        <div className="p-3 p-md-4 bg-light flex-grow-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default LayoutWrapper;
