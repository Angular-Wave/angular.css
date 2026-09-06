import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "patterns",
  directive: "ngCard",
  name: "card",
  selector: ".card",
});

test("card defaults yield to application component and utility layers", async ({
  page,
}) => {
  await page.goto("/src/patterns/card/card.html");
  await page.addStyleTag({
    content: `
      @layer components {
        .card { border-top-width: 7px; }
      }
      @layer utilities {
        .card { border-bottom-width: 9px; }
      }
    `,
  });

  const card = page.locator(".card");
  await expect(card).toHaveCSS("border-top-width", "7px");
  await expect(card).toHaveCSS("border-bottom-width", "9px");
});
