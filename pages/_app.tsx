import "@/styles/globals.css";

// Import packages

import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { ReactElement, ReactNode } from "react";

import Link from "next/link";

const listNav = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "root-api",
    href: "/root-api",
  },
  {
    name: "dashboard",
    href: "/dashboard",
  },
];

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  authGuard?: boolean;
  guestGuard?: boolean;
  setConfig?: () => void;
};

type Props = AppProps & {
  Component: NextPageWithLayout;
  getLayout?: (page: ReactElement) => ReactNode;
  authGuard?: boolean;
  guestGuard?: boolean;
  setConfig?: () => void;
};

const App = (props: Props) => {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <nav>
        <div style={{ display: "flex" }}>
          {listNav.map((nav) => (
            <div
              key={nav.href}
              style={{
                marginRight: "20px",
              }}
            >
              <Link href={nav.href}>{nav.name}</Link>
            </div>
          ))}
        </div>
      </nav>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
};

export default App;
