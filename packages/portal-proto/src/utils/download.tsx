import Cookies from "universal-cookie";
import { CoreDispatch, GDC_APP_API_AUTH, Modals, showModal } from "@gff/core";
import { Button } from "@mantine/core";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { includes, isPlainObject, reduce, uniqueId } from "lodash";
import { RiCloseCircleLine as CloseIcon } from "react-icons/ri";
import { theme } from "tailwind.config";
import urlJoin from "url-join";

const hashString = (s: string) =>
  s.split("").reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0);

const getBody = (iframe: HTMLIFrameElement) => {
  const document = iframe.contentWindow || iframe.contentDocument;
  return (document as Window).document.body || (document as Document).body;
};

const toHtml = (key: string, value: any) =>
  `<input
    type="hidden"
    name="${key}"
    value="${
      isPlainObject(value)
        ? JSON.stringify(value).replace(/"/g, "&quot;")
        : value
    }"
  />`;

const customKeys = ["expand", "fields", "facets"];

const processParamObj = (key: string, value: any) =>
  includes(customKeys, key) ? [].concat(value).join() : value;

const DownloadNotification = ({ onClick }: { onClick: () => void }) => {
  return (
    <div>
      <p>Download preparation in progress. Please wait...</p>
      <Button
        variant="white"
        leftIcon={<CloseIcon />}
        style={{ color: "#155276", cursor: "pointer" }}
        onClick={onClick}
      >
        Cancel Download
      </Button>
    </div>
  );
};

/*
const SlowDownloadNotification = ({ onClick }: { onClick: () => void }) => (
  <>
    <div>
      <div>
        The download preparation can take time due to different factors (total
        file size, number of files, or number of concurrent users).
      </div>
      <div>
        We recommend that you use the{" "}
        <a
          href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          GDC Data Transfer Tool
        </a>{" "}
        or cancel the download and try again later.
      </div>
      <Button
        variant="white"
        leftIcon={<CloseIcon />}
        style={{ color: "#155276", cursor: "pointer" }}
        onClick={onClick}
      >
        Cancel Download
      </Button>
    </div>
  </>
);
*/

/**
 * @param endpoint endpoint to be attached with  GDC AUTH API
 * @param params body to be attached with post request
 * @param method Request Method: GET, PUT, POST
 * @param dispatch dispatch send from the parent component to dispatch Modals
 * @param options options object provided to fetch, see here for possible values: https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * @param queryParams body to be attached with POST request or url params with GET request
 * @param done callback function to be called after the download has been initiated
 * @param Modal400 Modal for 400 error
 * @param Modal403 Modal for 403 error
 * @param customErrorMessage custom mesage to be passed for 400 errors
 * @return Promise<void>
 */

const download = async ({
  endpoint,
  params,
  method,
  dispatch,
  done,
  Modal400 = Modals.GeneralErrorModal,
  Modal403 = Modals.NoAccessModal,
  customErrorMessage,
}: {
  endpoint: string;
  params: Record<string, any>;
  method: string;
  dispatch: CoreDispatch;
  done?: () => void;
  Modal403?: Modals;
  Modal400?: Modals;
  customErrorMessage?: string;
}): Promise<void> => {
  const cookies = new Cookies();

  const downloadToken = uniqueId(`${+new Date()}-`);
  // a cookie value that the server will remove as a download-ready indicator
  const cookieKey = navigator.cookieEnabled
    ? Math.abs(hashString(JSON.stringify(params) + downloadToken)).toString(16)
    : null;

  if (cookieKey) {
    cookies.set(cookieKey, downloadToken);
  }

  // place notification in timeout to avoid flicker on fast calls
  const showNotificationTimeout = setTimeout(
    () =>
      showNotification({
        message: (
          <DownloadNotification
            onClick={() => {
              iFrame.remove();
              cleanNotifications();
              if (done) {
                done();
              }
            }}
          />
        ),
        styles: () => ({
          root: {
            textAlign: "center",
          },
          closeButton: {
            color: "black",
            "&:hover": {
              backgroundColor: theme.extend.colors["gdc-grey"].lighter,
            },
          },
        }),
      }),
    100,
  ); // set to 100 as that is perceived as instant

  const fields = reduce(
    {
      ...params,
      downloadCookieKey: cookieKey,
      downloadCookiePath: "/",
      attachment: true,
    },
    (result, value, key) => {
      const paramValue = processParamObj(key, value);
      return (
        result +
        [].concat(paramValue).reduce((acc, v) => acc + toHtml(key, v), "")
      );
    },
    "",
  );

  const iFrame = document.createElement("iframe");
  iFrame.style.display = "none";
  iFrame.src = "about:blank";

  // Appending to document body to allow navigation away from the current
  // page and downloads in the background
  document.body.appendChild(iFrame);

  // TODO - handle slow download notification PEAR-624
  const pollForDownloadResult = async () => {
    const executePoll = async (resolve: (value?: unknown) => void) => {
      // Request has been canceled
      console.log(iFrame);
      if (iFrame === undefined) {
        resolve();
        return;
      }

      const body = iFrame.contentWindow.document.body.textContent;
      // Download has started
      if (!cookies.get(cookieKey)) {
        clearTimeout(showNotificationTimeout);
        cleanNotifications();
        setTimeout(() => {
          if (done) {
            done();
          }
        }, 1000);
        resolve();
      } else {
        const requestError =
          iFrame.contentWindow.document.getElementsByTagName("form").length ===
            0 && body !== "";
        if (requestError) {
          console.log(body);
          clearTimeout(showNotificationTimeout);
          cleanNotifications();
          const errorMessage = /{"(?:message|error)":"([^"]*)"/g.exec(
            body,
          )?.[1];
          if (
            errorMessage === "internal server error" ||
            errorMessage === undefined
          ) {
            dispatch(showModal({ modal: Modal400, message: errorMessage }));
          } else if (
            errorMessage ===
            "Your token is invalid or expired. Please get a new token from GDC Data Portal."
          ) {
            dispatch(showModal({ modal: Modal403, message: errorMessage }));
          } else {
            dispatch(
              showModal({
                modal: Modal400,
                message: customErrorMessage || errorMessage,
              }),
            );
          }

          setTimeout(() => {
            if (done) {
              done();
            }
          }, 1000);
          resolve();
        } else {
          setTimeout(executePoll, 1000, resolve);
        }
      }
    };

    return new Promise(executePoll);
  };

  const addFormAndSubmit = () => {
    //do all of this together for FireFox support
    const form = document.createElement("form");
    form.method = method.toUpperCase();
    form.action = urlJoin(GDC_APP_API_AUTH, endpoint);
    form.innerHTML = fields;

    getBody(iFrame).appendChild(form);

    form.submit();
  };

  /*
  const handleDownloadResponse = async (res: Response) => {
    console.log(cookies);
    clearTimeout(showNotificationTimeout);
    cleanNotifications();
    if (!canceled && res.ok) {
      addFormAndSubmit();
      pollForDownloadResult();
      setTimeout(() => {
        if (done) {
          done();
        }
      }, 1000);
      return;
    }
    if (done) {
      done();
    }
    let errorMessage;
    try {
      const body = await res.json();
      errorMessage = body.message;
    } catch (error) {
      errorMessage = undefined;
    }

    if (res.status === 404 || res.status === 500) {
      dispatch(showModal({ modal: Modal400, message: errorMessage }));
      return;
    }

    if (res.status === 403) {
      dispatch(showModal({ modal: Modal403, message: errorMessage }));
      return;
    }
    if (res.status === 400) {
      dispatch(
        showModal({
          modal: Modal400,
          message: customErrorMessage || errorMessage,
        }),
      );
      return;
    }
  };

  const replacer = (_: string, value: any) => {
    if (typeof value === "boolean") {
      return value ? "True" : "False";
    }
    return value;
  };

  const signal = controller.signal;
  */
  //if (form) {
  addFormAndSubmit();
  pollForDownloadResult();
  setTimeout(() => {
    if (done) {
      done();
    }
  }, 1000);
};

export default download;
