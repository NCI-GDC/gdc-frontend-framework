import { CoreDispatch, GDC_APP_API_AUTH, Modals, showModal } from "@gff/core";
import { Button } from "@mantine/core";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { saveAs } from "file-saver";
import { RiCloseCircleLine as CloseIcon } from "react-icons/ri";
import { theme } from "tailwind.config";

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

/**
 * @param endpoint endpoint to be attached with  GDC AUTH API
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
  options,
  dispatch,
  queryParams,
  done,
  filename,
  Modal400 = Modals.GeneralErrorModal,
  Modal403 = Modals.NoAccessModal,
  customErrorMessage,
}: {
  endpoint: string;
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
  const controller = new AbortController();
  let downloadResolved = false;
  showNotification({
    message: (
      <DownloadNotification
        onClick={() => {
          cleanNotifications();
          controller.abort();
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
                  controller.abort();
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
  };

  const handleDownloadResponse = async (res: Response) => {
    cleanNotifications();
    if (res.ok) {
      const content = await res.blob();
      const name =
        filename ||
        res.headers.get("content-disposition").split("filename=")[1];
      saveAs(content, name);
      downloadResolved = true;
      if (done) {
        done();
      }
    }

    downloadResolved = true;
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

  const method = options?.method || "GET";

  if (method === "GET") {
    fetch(`${GDC_APP_API_AUTH}/${endpoint}${queryParams}`, {
      ...options,
      signal: controller.signal,
    }).then(handleDownloadResponse);
  } else {
    fetch(`${GDC_APP_API_AUTH}/${endpoint}`, {
      ...options,
      body: queryParams,
      signal: controller.signal,
    }).then(handleDownloadResponse);
  }

  slowDownloadNotificationPoll();
};

export default download;
