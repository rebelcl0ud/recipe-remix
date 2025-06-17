import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../../app/components/Footer";

describe("footer", () => {
  test("footer", async () => {
    render(<Footer />);

    expect(screen.getByText("© 2025 recipe remix"));
  });
});
