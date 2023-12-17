import { parseXML, serializeToXML } from "../lib/converter";
import fs from "node:fs";

describe("PodcastConverter", () => {
  it.each(["gitbar", "digitalia", "podcast20"])(
    "Should correctly serialize a %p with required fields",
    (i) => {
      const feedXML = fs.readFileSync(
        `${__dirname}/fixtures/${i}.xml`,
        "utf-8"
      );

      const json = parseXML(feedXML);

      const xml = serializeToXML(json);

      expect(xml).toMatchSnapshot();
      expect(json).toMatchSnapshot();
    }
  );
  it("Should throw exception when trying to convert not valid xml", () => {
    expect(() => parseXML(`dsadasdasdasd`)).toThrow("Invalid xml");
  });
  it("Should throw exception when trying to convert not valid podcast feed", () => {
    expect(() => parseXML(`<feed>foo</feed>`)).toThrow("Invalid podcast feed");
  });
});
