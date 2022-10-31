import { GDC_API } from "@gff/core";
import { NextApiHandler, NextApiRequest } from "next";
import axios, { AxiosResponse } from "axios";
import { Stream } from "stream";

export const config = {
  api: {
    // This api route is effectively a download proxy. Disabling the response size limt.
    responseLimit: false,
  },
};

const extractAxiosResponse = async (
  axiosPromise: Promise<AxiosResponse>,
): Promise<AxiosResponse> => {
  try {
    return await axiosPromise;
  } catch (error) {
    return error.response;
  }
};

const makeGdcApiRequest = async (
  request: NextApiRequest,
): Promise<AxiosResponse> => {
  // TODO:  Add X-Forward headers to ensure client ip address makes it to the server for logging
  if (request.method === "GET") {
    const { fileId } = request.query;
    const search = new URL(request.url, "http://placeholder").search;
    return await extractAxiosResponse(
      axios.get(`${GDC_API}/data/${fileId}${search}`, {
        responseType: "stream",
      }),
    );
  } else if (request.method === "POST") {
    const search = new URL(request.url, "http://placeholder").search;
    return await extractAxiosResponse(
      axios.post(`${GDC_API}/data${search}`, request.body, {
        responseType: "stream",
        headers: {
          "content-type": request.headers["content-type"],
        },
      }),
    );
  }
};

/**
 * This endpoint should have the same signature as the GDC API /data endpoint.
 */
const downloadHandler: NextApiHandler = async (request, response) => {
  if (!["GET", "POST"].includes(request.method)) {
    response
      .status(405)
      .json({ message: `Method Not Allowed: ${request.method}` });
    return;
  }

  const gdcApiResponse = await makeGdcApiRequest(request);

  // Pass along the headers and status. This is a bit of a lie.
  Object.entries(gdcApiResponse.headers).forEach(([tag, value]) => {
    response.setHeader(tag, value);
  });
  response.status(gdcApiResponse.status);

  if (gdcApiResponse.status === 200) {
    const stream: Stream = gdcApiResponse.data;
    stream.pipe(response);

    await new Promise((resolve, reject) => {
      stream.on("close", () => {
        console.log("successfully closed");
        resolve(response.end());
      });
      // NOTE: This error handling has not been tested yet
      stream.on("error", () => {
        console.log("error");
        reject(response.end());
      });
    });
  } else {
    response.send(gdcApiResponse.data);
  }
};

export default downloadHandler;
