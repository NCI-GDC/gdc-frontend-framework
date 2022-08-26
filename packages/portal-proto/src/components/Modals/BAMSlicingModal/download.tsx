import {
  CoreDispatch,
  fetchSlice,
  GDC_APP_API_AUTH,
  Modals,
  showModal,
  useCoreDispatch,
} from "@gff/core";
import Cookies from "js-cookie";
import {
  flow,
  isError,
  partial,
  attempt,
  isPlainObject,
  includes,
  uniqueId,
  assign,
  reduce,
} from "lodash";
import urlJoin from "url-join";

const getBody = (iframe) => {
  const document = iframe.contentWindow || iframe.contentDocument;
  console.log("DOCUMENT: ", document);
  return (document.document || document).body;
  // return document.activeElement;
};

// const cookiePath = document.querySelector('base').getAttribute('href')
const cookiePath = "/";
const getIframeResponse = (iFrame) => {
  console.log("BODY: ", getBody(iFrame));
};

const showErrorModal = (error) => {
  // const dispatch = useCoreDispatch();
  console.log("reached here in showError modal: ", error);
  // <BAMSlicingErrorModal openModal />
  // dispatch(showModal(Modals.BAMSlicingErrorModal));
};
// notification config

const progressChecker = (
  iFrame,
  cookieKey: string,
  downloadToken: string,
  altMessage: boolean,
  inProgress: Function,
  done: Function,
) => {
  inProgress();
  const waitTime = 1000;
  let attempts = 0;
  let timeoutPromise = null;

  console.log("REACHED INSIDE: ", iFrame);

  const cookieStillThere = () => downloadToken === Cookies.get(cookieKey); // TODO: not $

  const handleError = () => {
    // console.log(
    //   "inner: ",
    //   JSON.parse(getBody(iFrame).querySelector("pre").innerText),
    // );
    const error = flow(attempt, (e) => {
      console.log("error: ", e);
      console.log("isError(e): ", isError(e));
      return isError(e)
        ? {
            message: "GDC download service is currently experiencing issues.",
          }
        : e;
    })(partial(getIframeResponse, iFrame));

    console.log("error: ", error);
    return error;
  };

  const finished = () => {
    //console.info('Download check count & wait interval (in milliseconds):', attempts, waitTime);
    timeoutPromise = null;
    // window.store.dispatch(closeNotification());
    iFrame.parentNode.removeChild(iFrame);
    console.log("done: ", done);
    done();
  };

  const cancelDownload = () => {
    if (timeoutPromise) {
      clearTimeout(timeoutPromise);
      timeoutPromise = null;
    }
    finished();
  };

  const simpleMessage = (
    <div>
      <div>Download preparation in progress. Please wait…</div>
      <a onClick={cancelDownload}>
        <i className="fa fa-times-circle-o" /> Cancel Download
      </a>
    </div>
  );

  const detailedMessage = (
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
      <a
        onClick={cancelDownload}
        style={{
          textDecoration: "underline",
        }}
      >
        <strong>
          <i className="fa fa-times-circle-o" /> Cancel Download
        </strong>
      </a>
    </div>
  );

  const checker = () => {
    attempts++;
    // console.log("INSIDE CHECKER: ", attempts);
    // console.log("iFrame.__frame__loaded: ", iFrame.__frame__loaded);
    // // console.log("cookieStillThere: ", cookieStillThere);
    // console.log("downloadToken", downloadToken);
    // console.log("Cookies.get(cookieKey):", cookieKey, Cookies.get(cookieKey));
    console.log("iFrameeee pre: ", getBody(iFrame).querySelector("pre"));

    console.log("iFrameeee a: ", getBody(iFrame).querySelector("a"));

    // console.log("cookieStillThere: ", cookieStillThere());
    if (iFrame.__frame__loaded) {
      // console.log("IFRAME LOADED");
      // The downloadToken cookie is removed before the server sends the response
      // console.log("COOKIES: ", Cookies, cookieStillThere());

      if (cookieStillThere()) {
        console.log("inside here");
        const error = handleError();
        console.log("error sssss", error);
        Cookies.remove(cookieKey);
        finished();
        showErrorModal(error);
      } else {
        // A download should be now initiated.
        finished();
      }
    } else if (cookieStillThere()) {
      console.log("altMessage: ", altMessage);
      if (altMessage) {
        if (attempts === 5 || attempts === 2) {
          // window.store.dispatch(
          //   notify({
          //     action: "add",
          //     id: `download/${attempts}`,
          //     component: simpleMessage,
          //     delay: 1000,
          //   }),
          // );
        } else if (attempts === 6) {
          // window.store.dispatch(
          //   notify({
          //     action: "add",
          //     id: `download/${attempts}`,
          //     component: detailedMessage,
          //     delay: 0,
          //   }),
          // );
        }
      } else {
        // window.store.dispatch(
        //   notify({
        //     action: "add",
        //     id: `download/${attempts}`,
        //     component: simpleMessage,
        //     delay: 0,
        //   }),
        // );
      }
      console.log("reached here");
      timeoutPromise = setTimeout(checker, waitTime);
    } else {
      // In case the download is initiated without triggering the iFrame to reload
      finished();
    }
  };

  timeoutPromise = setTimeout(checker, waitTime);
};

const hashString = (s) =>
  s.split("").reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0);

const toHtml = (key, value) =>
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

type TDownloadCallbacks = (inProgress: Function, done: Function) => void;

const download = ({
  url,
  params,
  method = "GET",
  altMessage = false,
  done,
  dispatch,
}: {
  url: string;
  params: any;
  method: string;
  done: () => void;
  dispatch: CoreDispatch;
  altMessage?: boolean;
}) => {
  const downloadToken = uniqueId(`${+new Date()}-`);
  // a cookie value that the server will remove as a download-ready indicator
  const cookieKey = navigator.cookieEnabled
    ? Math.abs(hashString(JSON.stringify(params) + downloadToken)).toString(16)
    : null;

  if (cookieKey) {
    Cookies.set(cookieKey, downloadToken);
    assign(params, {
      downloadCookieKey: cookieKey,
      downloadCookiePath: cookiePath,
    });
  }

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

  console.log("fields:", fields);
  const iFrame = document.createElement("iframe");
  iFrame.style.display = "none";
  iFrame.src = "about:blank";
  iFrame.onload = function () {
    this.__frame__loaded = true;
  };

  // Appending to document body to allow navigation away from the current
  // page and downloads in the background
  document.body.appendChild(iFrame);
  iFrame.__frame__loaded = false;
  const form = document.createElement("form");
  form.method = method.toUpperCase();
  form.action = urlJoin(GDC_APP_API_AUTH, url);
  form.innerHTML = fields;

  getBody(iFrame).appendChild(form);

  // TODO: need to

  fetchSlice(url, params).then((res) => {
    done();
    if (res.status === 403) {
      // done();
      // setActive(false);
      dispatch(showModal(Modals.NoAccessModal));
      return;
    }
    if (res.status === 400) {
      // setActive(false);
      dispatch(showModal(Modals.BAMSlicingErrorModal));
      return;
    }

    if (res.ok) {
      form.submit();
    }
  });

  // console.log(
  //   "BEFORE Cookies.get(cookieKey):",
  //   cookieKey,
  //   Cookies.get(cookieKey),
  // );

  // return partial(progressChecker, iFrame, cookieKey, downloadToken, altMessage);
};

/*----------------------------------------------------------------------------*/

export default download;
