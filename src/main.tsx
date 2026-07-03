import type { ReactElement } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Loader from "./loader.tsx";
import "./main.css";
import styles from "./main.module.css";

const chromeExtensionProtocol = "chrome-extension:";
const chromeExtensionUrl =
  "https://chromewebstore.google.com/detail/hashpass/gkmegkoiplibopkmieofaaeloldidnko";
const githubUrl = "https://github.com/stepchowfun/hashpass";

const Main = (): ReactElement => {
  if (window.location.protocol === chromeExtensionProtocol) {
    return (
      <div className={styles.extensionContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.websiteContainer}>
      <h1 className={styles.heading}>
        <img alt="" className={styles.icon} src="images/icon.svg" /> Hashpass
      </h1>
      <div>
        <Loader />
      </div>
      <p className={styles.description}>
        Get the Chrome extension{" "}
        <a className={styles.link} href={chromeExtensionUrl}>
          here
        </a>
        . You can learn about Hashpass and browse its source code{" "}
        <a className={styles.link} href={githubUrl}>
          here
        </a>
        . This website collects no user data and makes no RPC calls.
      </p>
    </div>
  );
};

createRoot(document.body.appendChild(document.createElement("div"))).render(
  <StrictMode>
    <Main />
  </StrictMode>,
);
