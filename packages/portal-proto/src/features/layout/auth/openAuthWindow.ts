import { GDC_AUTH } from "@gff/core";

const openAuthWindow = () => {
  const pollInterval = 500;
  const winUrl = `${GDC_AUTH}?next=${location.origin + location.pathname}`;
  const winStyle = "width=800, height=600";

  return new Promise((resolve, reject) => {
    if (window.navigator.cookieEnabled) {
      const win = window.open(winUrl, "Auth", winStyle);
      const loginAttempt = () => {
        if (win.closed) {
          clearInterval(interval);
          reject("window closed manually");
        }
        if (
          win.document.URL.includes(location.origin) &&
          !win.document.URL.includes("auth")
        ) {
          // Window is not closed yet so close
          win.close();
          // Clear the interval calling this function
          clearInterval(interval);
          if (win.document.URL.includes("error=401")) {
            reject("login_error");
            return;
          }
          // Resolve that we have something good
          resolve("success");
        }
      };
      const interval = setInterval(loginAttempt, pollInterval);
    } else {
      reject("No cookies enabled");
    }
  });
};

export default openAuthWindow;
