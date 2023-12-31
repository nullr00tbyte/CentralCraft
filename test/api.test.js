import { getServerData } from "../src/functions/fetchServerData";
import { describe, expect, it } from "vitest";

describe("getServerData", () => {
  it("Should be a function", () => {
    expect(getServerData).toBeTypeOf("function");
  });

  it("Should be a object response", () => {
    expect(getServerData("play.blackpi.org")).toBeTypeOf("object");
  });

  it("Should throw if not a valid hostname", () => {
    expect(() => getServerData()).toThrow();
  });
});
