import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import Access, { AccessShell } from "./Access.js";
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

  it("reports a malformed email only as a stacked toast on submit, never inline below the field", () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <>
        <Toast />
        <Access heading="Entrar" fields={[{ name: "email", type: "email", label: "E-mail", placeholder: "E-mail", defaultValue: "sem-arroba" }]} submitLabel="Entrar" onSubmit={onSubmit} />
      </>,
    );
    expect(screen.queryByText(/e-mail válido/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByText(/e-mail válido/i)).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent(/e-mail válido/i);
    expect(container.querySelector('[id$="-feedback"]')).toBeNull();
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

  it("keeps the public rich error contract and renders the interactive logo", () => {
    const { container } = render(<Access heading="Entrar" error={<strong role="alert">Falha de acesso</strong>} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Falha de acesso");
    const logo = container.querySelector("button[aria-label]");
    expect(logo).toBeInTheDocument();
    expect(() => fireEvent.click(logo!)).not.toThrow();
  });
});

describe("persistent access shell", () => {
  function Steps() {
    const [step, setStep] = useState("entry");
    return (
      <AccessShell>
        <Access
          heading={step === "entry" ? "Entrada" : "Entrar"}
          stepKey={step}
          backAction={step === "signin" ? <button type="button">Voltar</button> : undefined}
          topAction={<button type="button">Idioma</button>}
          fields={step === "signin" ? [{ name: "email", type: "email", label: "E-mail", placeholder: "E-mail" }] : []}
          submitLabel={step === "signin" ? "Entrar" : undefined}>
          <button type="button" onClick={() => setStep("signin")}>
            Já tenho uma conta
          </button>
        </Access>
      </AccessShell>
    );
  }

  it("keeps the logo mounted while only the content below changes", () => {
    const { container } = render(<Steps />);
    const logo = container.querySelector("button[aria-label]");
    expect(logo).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Já tenho uma conta" }));
    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(container.querySelector("button[aria-label]")).toBe(logo);
  });

  it("shows the top and back actions in the shell and drops them when a step no longer provides them", () => {
    render(<Steps />);
    expect(screen.getByRole("button", { name: "Idioma" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Voltar" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Já tenho uma conta" }));
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
  });

  it("uses a 14 top spacing in the shell", () => {
    const { container } = render(<Access heading="Entrar" />);
    expect(container.querySelector("main")).toHaveClass("pt-14");
  });
});
