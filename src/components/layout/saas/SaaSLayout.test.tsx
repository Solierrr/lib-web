import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SaaSLayout from "./SaaSLayout.js";

vi.mock("../../brand/logo/OrganicLogo.js", () => ({ default: () => null }));

const groups = [
  {
    title: "Ambiente",
    items: [
      { to: "/", label: "Atalhos", icon: "home" as const },
      { to: "/devices", label: "Dispositivos", icon: "settings" as const },
    ],
  },
];

function renderLayout(onSignOut = vi.fn(), path = "/devices") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SaaSLayout title="Sandbox" identity="qa@solaria.com" groups={groups} onSignOut={onSignOut} badge={<span>QA</span>}>
        <p>conteudo</p>
      </SaaSLayout>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => vi.unstubAllGlobals());

describe("SaaSLayout", () => {
  it("renders the badge and content, starts collapsed and keeps the identity inside the account menu", () => {
    renderLayout();
    expect(screen.getByText("QA")).toBeInTheDocument();
    expect(screen.getByText("conteudo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Expandir menu" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("qa@solaria.com")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Conta" }));
    expect(screen.getByText("qa@solaria.com")).toBeInTheDocument();
  });

  it("expands to show the groups, marks the current page and offers the recents menu", () => {
    renderLayout();
    fireEvent.click(screen.getByRole("button", { name: "Expandir menu" }));
    expect(screen.getByRole("link", { name: "Dispositivos" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Atalhos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Recentes/ })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Buscar uma tela")).not.toBeInTheDocument();
  });

  it("searches screens with Ctrl+K and navigates to the chosen one", () => {
    renderLayout();
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    const search = screen.getByPlaceholderText("Buscar uma tela");
    fireEvent.change(search, { target: { value: "atal" } });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    fireEvent.keyDown(search, { key: "Enter" });
    expect(screen.queryByPlaceholderText("Buscar uma tela")).not.toBeInTheDocument();
  });

  it("remembers visited pages and signs out from the account menu", () => {
    const onSignOut = vi.fn();
    renderLayout(onSignOut);
    expect(JSON.parse(localStorage.getItem("solaria.sidebar.recent.Sandbox") ?? "[]")).toEqual(["/devices"]);
    fireEvent.click(screen.getByRole("button", { name: "Conta" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Sair" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
