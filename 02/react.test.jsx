import { describe, test, expect } from "vitest";
import AReact from "./AReact";

describe("AReact render", () => {
  test("render", () => {
    const ele = (
      <div id="d1">
        <div id="dd1">
          <div id="ddd1">div-ddd1</div>
          <div id="ddd2">div-ddd2</div>
        </div>
        <div id="dd2"></div>
        <span id="ss1"></span>
      </div>
    );

    const container = document.createElement("div");

    console.log("//", JSON.stringify(ele));
    AReact.createRoot(container).render(ele);

    expect(container.innerHTML).toBe(
      '<div id="d1"><div id="dd1"><div id="ddd1">div-ddd1</div><div id="ddd2">div-ddd2</div></div><div id="dd2"></div><span id="ss1"></span></div>'
    );
  });
});
