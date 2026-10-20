import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Access from "./Access.js";
import Toast from "../../feedback/toast/Toast.js";

vi.mock("./canvas/SideCanvas.js", () => ({ default: () => null }));

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => vi.unstubAllGlobals());

describe("shared access layout", () => {
  it("blocks incomplete submission and shows the existing stacked feedback", () => {
    const onSubmit = vi.fn();
    render(<><Toast /><Access heading="Entrar" fields={[{ name: "email", type: "email", label: "E-mail", placeholder: "E-mail" }]} submitLabel="Entrar" onSubmit={onSubmit} /></>);
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Preencha todos os campos obrigatórios para continuar.");
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("aria-invalid", "true");
  });

  it("only offers password visibility when a value exists", () => {
    render(<Access heading="Entrar" fields={[{ name: "password", label: "Senha", placeholder: "Senha", password: true }]} submitLabel="Entrar" />);
    expect(screen.queryByRole("button", { name: "password" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "test-password" } });
    fireEvent.click(screen.getByRole("button", { name: "password" }));
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "text");
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "" } });
    expect(screen.queryByRole("button", { name: "password" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
  });

  it("keeps the public rich error contract and embeds the logo without a host asset", () => {
    const { container } = render(<Access heading="Entrar" error={<strong role="alert">Falha de acesso</strong>} logoInteractive />);
    expect(screen.getByRole("alert")).toHaveTextContent("Falha de acesso");
    expect(container.querySelector('svg svg path[fill="white"]')).toBeInTheDocument();
    expect(container.querySelector('use[href^="/branding/"]')).toBeNull();
  });
});
