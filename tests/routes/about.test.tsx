import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../../app/routes/about";

describe("about page", () => {
  test("about page h1", () => {
    render(<About />);

    expect(screen.getByText("Why make this?"));
  });
});
