import type { Meta, StoryObj } from "@storybook/react-vite";
import Sidebar from "./Sidebar";
import { SidebarOption } from "./Sidebar.reusables";

const meta = {
  title: "Layout/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Options() {
  return (
    <>
      <SidebarOption to="#home" icon="home" content="Início" />
      <SidebarOption to="#search" icon="search" content="Painéis solares" />
      <SidebarOption to="#profile" icon="user" content="Perfil" />
      <SidebarOption to="#settings" icon="settings" content="Configurações" />
    </>
  );
}

export const Default: Story = {
  args: { children: <Options /> },
  render: () => (
    <div className="flex h-screen">
      <Sidebar>
        <Options />
      </Sidebar>
    </div>
  ),
};

export const Collapsed: Story = {
  args: { children: <Options /> },
  render: () => (
    <div className="flex h-screen">
      <Sidebar defaultCollapsed>
        <Options />
      </Sidebar>
    </div>
  ),
};
