import { ENV } from "@/utils/constants";
import ImageKit from "imagekit"; // If ImageKit is the default export

export const imageKit = new ImageKit({
  publicKey: ENV.IMAGEKIT_PUBLIC_KEY,
  privateKey: ENV.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: ENV.IMAGEKIT_URL_ENDPOINT,
});
