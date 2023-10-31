import { parseXML, serializeToXML } from "../lib/converter";
import "jest-xml-matcher";
import fs from "node:fs";

describe("PodcastConverter", () => {
  it.each(["gitbar", "digitalia", "podcast20"])(
    "Should correctly serialize a %p with required fields",
    async (i) => {
      const feedXML = fs.readFileSync(
        `${__dirname}/fixtures/${i}.xml`,
        "utf-8"
      );

      const json = await parseXML(feedXML);

      const xml = serializeToXML(json);

      expect(xml).toMatchSnapshot();
      expect(json).toMatchSnapshot();
    }
  );
  it("Should throw exception when trying to convert not valid xml", async () => {
    const json = parseXML(`dsadasdasdasd`);
    expect(json).rejects.toThrow("Invalid xml");
  });
  it("Should throw exception when trying to convert not valid podcast feed", async () => {
    const json = parseXML(`<feed>foo</feed>`);
    expect(json).rejects.toThrow("Invalid podcast feed");
  });
});
