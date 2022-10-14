import { isPlainObject, includes, reduce } from "lodash";
import urlJoin from "url-join";
import { CoreDispatch, GDC_APP_API_AUTH, Modals, showModal } from "@gff/core";
import { Button } from "@mantine/core";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { RiCloseCircleLine as CloseIcon } from "react-icons/ri";
import { theme } from "tailwind.config";

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
 * @param filename
 * @param Modal400 Modal for 400 error
 * @param Modal403 Modal for 403 error
 * @param customErrorMessage custom mesage to be passed for 400 errors
 * @return Promise<void>
 */

const download = async ({
  endpoint,
  params,
  method,
  options,
  dispatch,
  queryParams,
  done,
  Modal400 = Modals.GeneralErrorModal,
  Modal403 = Modals.NoAccessModal,
  customErrorMessage,
}: {
  endpoint: string;
  params: Record<string, any>;
  method: string;
  options: Record<string, any>;
  dispatch: CoreDispatch;
  queryParams?: string;
  done?: () => void;
  filename?: string;
  altMessage?: boolean;
  Modal403?: Modals;
  Modal400?: Modals;
  customErrorMessage?: string;
}): Promise<void> => {
  let canceled = false;
  showNotification({
    message: (
      <DownloadNotification
        onClick={() => {
          cleanNotifications();
          canceled = true;
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
        "&:hover": { backgroundColor: theme.extend.colors["gdc-grey"].lighter },
      },
    }),
  });

  const fields = reduce(
    params,
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
  const form = document.createElement("form");
  form.method = method.toUpperCase();
  form.action = urlJoin(GDC_APP_API_AUTH, endpoint);
  form.innerHTML = fields;

  getBody(iFrame).appendChild(form);

  // TODO - handle slow download notification PEAR-624
  /*
  const slowDownloadNotificationPoll = async () => {
    let attempts = 0;

    const executePoll = async (resolve: (value?: unknown) => void) => {
      attempts++;
      if (!downloadResolved && !controller.signal.aborted) {
        if (attempts === 6) {
          showNotification({
            message: (
              <SlowDownloadNotification
                onClick={() => {
                  cleanNotifications();
                  cancel = true;
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
          });
          resolve();
        } else {
          setTimeout(executePoll, 1000, resolve);
        }
      } else {
        resolve();
      }
    };

    return new Promise(executePoll);
  };*/

  const handleDownloadResponse = async (res: Response) => {
    cleanNotifications();
    if (!canceled && res.ok) {
      form.submit();
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

  if (queryParams === undefined) {
    if ((options?.method || "GET") === "GET") {
      queryParams = Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");
    } else {
      queryParams = JSON.stringify(
        {
          ...params,
          ...(params.filters
            ? { filters: JSON.stringify(params.filters) }
            : {}),
        },
        replacer,
      );
    }
  }

  if ((options?.method || "GET") === "POST") {
    fetch(`${GDC_APP_API_AUTH}/${endpoint}`, {
      ...options,
      body: queryParams,
    }).then(handleDownloadResponse);
  } else {
    fetch(`${GDC_APP_API_AUTH}/${endpoint}?${queryParams}`, {
      ...options,
    }).then(handleDownloadResponse);
  }
};

export default download;
