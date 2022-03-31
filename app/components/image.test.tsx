import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Image } from "./image";

describe("Image", () => {
  it("correctly creates src without parameters", () => {
    render(<Image src="/image.jpg" alt="the_alt_text" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/assets/image?src=%2Fimage.jpg&");
  });

  it("correctly creates src with parameters", () => {
    render(
      <Image
        src="/image.jpg"
        width={400}
        height={500}
        position="top"
        quality={80}
        alt="the_alt_text"
      />
    );
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute(
      "src",
      "/assets/image?src=%2Fimage.jpg&width=400&height=500&position=top&quality=80"
    );
  });
});
