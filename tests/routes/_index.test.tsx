import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../../app/routes/_index";

describe("homepage", () => {
  test("title page", async () => {
    render(<Home />);
    expect(screen.getByText("recipe remix"));
  });
});
