"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/Dropdown";
import Skeleton from "react-loading-skeleton";
import { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import Search from "@/components/Search";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const LoginProfileContainer = (
    <React.Fragment>
      {session && (
        <Dropdown
          top="40px"
          trigger={
            <div className="dropdown-arrow">
              <Image src="/images/user.png" width={27} height={27} alt="" />
            </div>
          }
          items={[
            {
              label: "My Account",
              icon: "/images/profile.png",
              iconWidth: 20,
              iconHeight: 20,
              onClick: () => router.push("/my-account"),
            },
            {
              label: "Signout",
              icon: "/images/logout.png",
              iconWidth: 20,
              iconHeight: 20,
              onClick: () => signOut(""),
            },
          ]}
        />
      )}
      {status !== "loading" && !session && (
        <Image
          src="/images/login.png"
          width={27}
          height={27}
          alt=""
          className="cursor-pointer"
          onClick={() => router.push("/login")}
        />
      )}
      {status === "loading" && (
        <Skeleton width={25} height={25} borderRadius={100} />
      )}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Toaster />
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <Link href="/">
              <Image
                src="https://html.xpressbuddy.com/coinpay/assets/images/site_logo/site_logo_1.svg"
                alt="logo"
                width={120}
                height={30}
                unoptimized
              />
            </Link>
          </div>
          <div className="menu-icon" onClick={handleShowNavbar}>
            <Image
              src="/images/hamburger.png"
              width={27}
              height={27}
              alt=""
              className="pt-2"
              onClick={handleShowNavbar}
            />
          </div>
          <div className={`nav-elements  ${showNavbar && "active"}`}>
            <div
              style={{
                display: showNavbar ? "" : "none",
                position: "absolute",
                top: "18px",
                right: "-30px",
                background: "#cbcbcb",
                padding: "10px 10px",
              }}
            >
              <Image
                src="/images/close.png"
                width={10}
                height={10}
                alt=""
                onClick={() => handleShowNavbar(true)}
                className="cursor-pointer"
              />
            </div>
            <ul>
              <li className="is-responsive-header">
                <div className="logo ">
                  <Link href="/">
                    <Image
                      src="https://html.xpressbuddy.com/coinpay/assets/images/site_logo/site_logo_1.svg"
                      alt="logo"
                      width={120}
                      height={40}
                      unoptimized
                    />
                  </Link>
                </div>
              </li>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="https://www.coingecko.com/" target="_blank">
                  CoinGecko
                </Link>
              </li>
              {/* <li>
                <label className="toggle">
                  <input className="toggle-checkbox" type="checkbox" />
                  <div className="toggle-switch"></div>
                  <span className="toggle-label">Light Mode</span>
                </label>
              </li> */}
              <li>{LoginProfileContainer}</li>
            </ul>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Header;
