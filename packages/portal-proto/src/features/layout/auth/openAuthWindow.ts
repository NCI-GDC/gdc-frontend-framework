import { GDC_AUTH } from "@gff/core";

const openAuthWindow = (): Promise<unknown> => {
  const pollInterval = 500;
  const winUrl = `${GDC_AUTH}?next=${location.origin + location.pathname}`;
  const winStyle = "width=1000, height=800";

  return new Promise((resolve, reject) => {
    if (window.navigator.cookieEnabled) {
      const win = window.open(winUrl, "Auth", winStyle);
      const loginAttempt = () => {
        if (win.closed) {
          clearInterval(interval);
          reject("window closed manually");
        }
        try {
          if (
            win.document.URL.includes(location.origin) &&
            !win.document.URL.includes("auth")
          ) {
            win.close();
            clearInterval(interval);
            if (win.document.URL.includes("error=401")) {
              reject("login_error");
              return;
            }
            resolve("success");
          }
        } catch (err) {
          // just want to catch it and not reject it
        }
      };
      const interval = setInterval(loginAttempt, pollInterval);
    } else {
      reject("No cookies enabled");
    }
  });
};

export default openAuthWindow;
