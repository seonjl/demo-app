import { getMetadata } from "./s3.service";

describe("s3", () => {
  test("getMetadata", async () => {
    const result = await getMetadata({
      bucket: "file-inventory-bucket-2024-08-27",
      key: "seonjl.dev@gmail.com/file.edox4fp015p",
    });

    console.log("📢 result");
    console.log(result);
  });
});
