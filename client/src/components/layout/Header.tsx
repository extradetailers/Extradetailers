"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import {
  MdDashboard,
  MdLogin,
  MdLogout,
  MdShoppingCartCheckout,
} from "react-icons/md";
import styles from "./header.module.scss";
import useUser from "@/hooks/useUser";
import { EUserRole, IBooking } from "@/types";
import { DefaultError, useMutation } from "@tanstack/react-query";
import { useSignoutOptions } from "@/app/_requests/auth";
import LocalStorage from "@/utils/LocalStorage";

const menuItems: string[] = [
  "Service",
  "About Us",
  "Gallery",
  "Packages",
  "Contact",
  "FAQ",
  "Testimonials",
];

function Header() {
  const signoutMutation = useMutation<unknown, DefaultError>(
    useSignoutOptions()
  );
  const user = useUser();
  const [cartItems, setCartItems] = useState<IBooking[]>([]);
  const handleSignout = (e: React.SyntheticEvent) => {
    e.preventDefault();
    signoutMutation.mutate();
  };

  useEffect(() => {
    const items = LocalStorage.getBookings();
    setCartItems(items);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg text-white border-bottom ${styles.navbarContent}`}
    >
      <div className="container">
        {/* Mobile Menu Toggle Button */}
        <button
          className={`navbar-toggler border text-white`}
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu"
          aria-controls="mobileMenu"
          aria-label="Toggle navigation"
        >
          <CiMenuBurger size={24} />
        </button>

        {/* Logo */}
        <Link className="navbar-brand" href="/">
          <Image
            height={100}
            width={100}
            alt="extra-detailers-logo"
            src="/logo.png"
            className={styles.headerLogo}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {menuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <strong>
                  <Link
                    className="nav-link text-white text-uppercase"
                    href={`/${item.replace(/\s/g, "-").toLowerCase()}`}
                  >
                    {item}
                  </Link>
                </strong>
              </li>
            ))}
          </ul>
          <div className="d-flex gap-2 align-items-center">
            <Link href="/dashboard/checkout" className="mb-4">
              <MdShoppingCartCheckout size={40} />{" "}
              {cartItems.length > 0 ? cartItems.length : ""}
            </Link>
            {user ? (
              <>
                {user.userRole === EUserRole.ADMIN ? (
                  <Link href="/admin" className="btn btn-outline-light">
                    <MdDashboard /> Admin
                  </Link>
                ) : (
                  <Link href="/dashboard" className="btn btn-outline-light">
                    <MdDashboard /> Dashboard
                  </Link>
                )}

                <button
                  onClick={handleSignout}
                  type="button"
                  className="btn btn-danger"
                >
                  <MdLogout /> Logout
                </button>
              </>
            ) : (
              <Link href="/signin" className="btn btn-primary">
                <MdLogin /> Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Offcanvas Mobile Menu */}
      <div
        className={`offcanvas offcanvas-start d-block d-md-none bg-secondary ${styles.mobileMenu}`}
        tabIndex={-1}
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header">
          <Link className="navbar-brand" href="/">
            <Image
              height={100}
              width={100}
              alt="extra-detailers-logo"
              src="/logo.png"
              className={styles.headerLogo}
            />
          </Link>
          <button
            type="button"
            className={`btn-close btn-close-white ${styles.closeButton}`}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            {menuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <strong>
                  <Link
                    className="nav-link text-white text-uppercase"
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    data-bs-dismiss="offcanvas"
                  >
                    {item}
                  </Link>
                </strong>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link href="/checkout" className="mb-4">
              <MdShoppingCartCheckout size={40} />{" "}
              {cartItems.length > 0 ? cartItems.length : ""}
            </Link>
            {user ? (
              <>
                {user.userRole === EUserRole.ADMIN ? (
                  <Link
                    href="/admin"
                    className="btn btn-outline-light w-100 mb-2"
                  >
                    <MdDashboard /> Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="btn btn-outline-light w-100 mb-2"
                  >
                    <MdDashboard /> Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignout}
                  type="button"
                  className="btn btn-danger w-100"
                >
                  <MdLogout /> Logout
                </button>
              </>
            ) : (
              <Link href="/signin" className="btn btn-primary w-100">
                <MdLogin /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
