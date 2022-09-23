import { CoreDispatch, GDC_APP_API_AUTH, Modals, showModal } from "@gff/core";
import { Button } from "@mantine/core";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { isPlainObject, includes, reduce } from "lodash";
import urlJoin from "url-join";
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

/**
 * @param endpoint endpoint to be attached with  GDC AUTH API
 * @param params body to be attached with post request
 * @param method Request Method: GET, PUT, POST
 * @param done callback function to be called after the download has been initiated
 * @param dispatch dispatch send from the parent component to dispatch Modals
 * @param queryParams option param, only to be sent if queryParams need special manipulation
 * @param Modal400 Modal for 400 error
 * @param Modal403 Modal for 403 error
 * @param customErrorMessage custom mesage to be passed for 400 errors
 * @return Promise<void>
 */

const download = async ({
  endpoint,
  params,
  method = "GET",
  done,
  dispatch,
  queryParams,
  Modal400 = Modals.GeneralErrorModal,
  Modal403 = Modals.NoAccessModal,
  options,
  customErrorMessage,
}: {
  endpoint: string;
  params: Record<string, any>;
  options: Record<string, any>;
  method: string;
  done?: () => void;
  dispatch: CoreDispatch;
  queryParams?: string;
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
          done();
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

  if (!queryParams) {
    queryParams = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");
  }

  fetch(`${GDC_APP_API_AUTH}/${endpoint}?${queryParams}`, options).then(
    async (res) => {
      cleanNotifications();
      if (!canceled && res.ok) {
        form.submit();
        setTimeout(() => {
          done();
        }, 1000);
        return;
      }
      done();
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
    },
  );
};

export default download;
