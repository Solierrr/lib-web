import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import GroupAction from "./GroupAction.js";
import SurfaceGroup from "../surface/SurfaceGroup.js";

describe("SurfaceGroup and GroupAction", () => {
  it("lays items out with dividers and no inner padding so they fill the card", () => {
    const { container } = render(
      <SurfaceGroup direction="horizontal">
        <GroupAction layout="icon" icon="google" label="Google" />
        <GroupAction layout="icon" icon="microsoft" label="Microsoft" />
      </SurfaceGroup>,
    );
    const content = container.firstElementChild?.firstElementChild;
    expect(content).toHaveClass("flex-row", "divide-x");
    expect(content?.className).not.toMatch(/(^|\s)p-\d/);
    expect(screen.getByRole("button", { name: "Google" })).toHaveClass("h-12", "w-12");
  });

  it("drops the divider lines when the group is not divided", () => {
    const { container } = render(
      <SurfaceGroup direction="horizontal" divided={false}>
        <GroupAction layout="icon" icon="google" label="Google" />
        <GroupAction layout="icon" icon="microsoft" label="Microsoft" />
      </SurfaceGroup>,
    );
    const content = container.firstElementChild?.firstElementChild;
    expect(content).toHaveClass("flex-row");
    expect(content?.className).not.toMatch(/divide-/);
  });

  it("stacks vertical rows and shows the content with an optional detail line", () => {
    const onClick = vi.fn();
    render(
      <SurfaceGroup>
        <GroupAction icon="user" label="Continuar como a@b.com" content="Entrar com e-mail" detail="a@b.com" onClick={onClick} />
      </SurfaceGroup>,
    );
    const action = screen.getByRole("button", { name: "Continuar como a@b.com" });
    expect(action).toHaveTextContent("Entrar com e-mail");
    expect(action).toHaveTextContent("a@b.com");
    fireEvent.click(action);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders as a link when given a destination and keeps disabled buttons inert", () => {
    const onClick = vi.fn();
    render(
      <MemoryRouter>
        <SurfaceGroup>
          <GroupAction icon="userPlus" label="Criar conta" content="Quero criar uma conta" to="/cadastro" />
          <GroupAction icon="login" label="Entrar" content="Entrar" disabled onClick={onClick} />
        </SurfaceGroup>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Criar conta" })).toHaveAttribute("href", "/cadastro");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("accepts a short text in the icon layout", () => {
    render(
      <SurfaceGroup direction="horizontal">
        <GroupAction layout="icon" content="?" label="Ajuda" />
      </SurfaceGroup>,
    );
    expect(screen.getByRole("button", { name: "Ajuda" })).toHaveTextContent("?");
  });
});
