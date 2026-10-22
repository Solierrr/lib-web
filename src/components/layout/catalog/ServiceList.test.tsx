import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ServiceList from "./ServiceList.js";
import { GitHubIcon, SwaggerIcon } from "../../brand/stack-icons/StackIcons.js";

const writeText = vi.fn();

beforeEach(() => {
  writeText.mockReset();
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

const items = [
  {
    name: "api-core",
    description: "Cadastros centrais",
    links: [
      { label: "GitHub", icon: <GitHubIcon />, href: "https://github.com/Solierrr/api-core" },
      { label: "Swagger", icon: <SwaggerIcon />, tag: "PROD", href: "https://api-core.solarianetwork.site/swagger-ui/index.html" },
      { label: "Swagger", icon: <SwaggerIcon />, tag: "QA" },
    ],
  },
];

describe("ServiceList", () => {
  it("shows each service as a row of symbols that open in a new tab", () => {
    render(<ServiceList items={items} />);
    expect(screen.getByText("api-core")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /api-core GitHub/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /api-core Swagger/ })).toHaveAttribute(
      "href",
      "https://api-core.solarianetwork.site/swagger-ui/index.html",
    );
  });

  it("marks a missing environment as unavailable instead of linking it", () => {
    render(<ServiceList items={items} />);
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByText(/api-core Swagger: Não configurado/)).toBeInTheDocument();
  });

  it("copies the exact link next to the symbol and confirms it", async () => {
    writeText.mockResolvedValue(undefined);
    render(<ServiceList items={items} />);
    fireEvent.click(screen.getByRole("button", { name: /Copiar link: api-core GitHub/ }));
    expect(await screen.findByText("Link copiado")).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith("https://github.com/Solierrr/api-core");
  });

  it("reports a failed copy", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    render(<ServiceList items={items} />);
    fireEvent.click(screen.getByRole("button", { name: /Copiar link: api-core GitHub/ }));
    expect(await screen.findByText("Não foi possível copiar")).toBeInTheDocument();
  });
});
