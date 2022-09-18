import { CoreDispatch, GDC_APP_API_AUTH, Modals, showModal } from "@gff/core";
import { Button } from "@mantine/core";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { isPlainObject, includes, reduce } from "lodash";
import urlJoin from "url-join";
import { RiCloseCircleLine as CloseIcon } from "react-icons/ri";

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

const arrayToStringFields = ["expand", "fields", "facets"];

const arrayToStringOnFields = (key, value, fields) =>
  includes(fields, key) ? [].concat(value).join() : value;

/**
 * @param endpoint endpoint to be attached with  GDC AUTH API
 * @param params body to be attached with post request
 * @param method Request Method: GET, PUT, POST
 * @param done callback function to be called after the download has been initiated
 * @param dispatch dispatch send from the parent component to dispatch Modals
 * @param queryParams option param, only to be sent if queryParams need special manipulation
 * @param Modal400 Modal for 400 error
 * @param Modal403 Modal for 403 error
 * @return Promise<void>
 */

const download = async ({
  endpoint,
  params,
  method = "GET",
  done,
  dispatch,
  queryParams,
  Modal400,
  Modal403,
  options,
}: {
  endpoint: string;
  params: Record<string, any>;
  options: Record<string, any>;
  method: string;
  done: () => void;
  dispatch: CoreDispatch;
  queryParams?: string;
  altMessage?: boolean;
  Modal403: Modals;
  Modal400: Modals;
}): Promise<void> => {
  let timeoutPromise = null;
  showNotification({
    message: (
      <div>
        <p>Download preparation in progress. Please wait...</p>
        <Button
          variant="white"
          leftIcon={<CloseIcon />}
          style={{ color: "#155276", cursor: "pointer" }}
          onClick={() => {
            cleanNotifications();
            if (timeoutPromise) {
              clearTimeout(timeoutPromise);
              timeoutPromise = null;
            }
            done();
          }}
        >
          Cancel Download
        </Button>
      </div>
    ),
    styles: () => ({
      root: {
        backgroundColor: "#4dbc97",
        textAlign: "center",
        borderColor: "#4dbc97",
        "&::before": { backgroundColor: "#4dbc97" },
      },
      closeButton: {
        color: "black",
        "&:hover": { backgroundColor: "#e6e6e6" },
      },
      icon: {
        height: 0,
        width: 0,
      },
    }),
    icon: <div />,
  });

  const fields = reduce(
    params,
    (result, value, key) => {
      const paramValue = arrayToStringOnFields(key, value, arrayToStringFields);
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

  timeoutPromise = setTimeout(() => {
    fetch(`${GDC_APP_API_AUTH}/${queryParams}`, options).then((res) => {
      cleanNotifications();
      if (res.status === 403) {
        done();
        // TODO: might need to save response error message later if needed in modal slice.
        dispatch(showModal(Modal403));
        return;
      }
      if (res.status === 400) {
        done();
        dispatch(showModal(Modal400));
        return;
      }
      if (timeoutPromise && res.ok) {
        form.submit();
        setTimeout(() => {
          done();
        }, 1000);
      }
    });
  }, 1000);
};

export default download;
