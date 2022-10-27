import { GDC_API } from "@gff/core";
import { NextApiHandler } from "next";
import axios, { AxiosResponse } from "axios";
import { Stream } from "stream";

export const config = {
  api: {
    responseLimit: false,
  },
};

const getApiResponse = async (url: string): Promise<AxiosResponse> => {
  try {
    return await axios.get(url, {
      responseType: "stream",
    });
  } catch (error) {
    return error.response;
  }
};

const postApiResponse = async (
  url: string,
  data: any,
  contentType: string,
): Promise<AxiosResponse> => {
  try {
    return await axios.post(url, data, {
      responseType: "stream",
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const downloadHandler: NextApiHandler = async (request, response) => {
  let apiResponse: AxiosResponse;

  if (request.method === "GET") {
    const { fileId } = request.query;

    const search = new URL(request.url, "http://placeholder").search;
    apiResponse = await getApiResponse(`${GDC_API}/data/${fileId}${search}`);
  } else if (request.method === "POST") {
    const search = new URL(request.url, "http://placeholder").search;
    apiResponse = await postApiResponse(
      `${GDC_API}/data${search}`,
      request.body,
      request.headers["content-type"],
    );
  }

  Object.entries(apiResponse.headers).forEach(([tag, value]) => {
    response.setHeader(tag, value);
  });
  response.status(apiResponse.status);

  if (apiResponse.status === 200) {
    const stream: Stream = apiResponse.data;
    stream.on("data", (data) => {
      response.write(data);
    });

    await new Promise((resolve, reject) => {
      stream.on("end", () => resolve(response.end()));
      stream.on("error", () => reject(response.end()));
    });
  } else {
    response.send(apiResponse.data);
  }
};

export default downloadHandler;
