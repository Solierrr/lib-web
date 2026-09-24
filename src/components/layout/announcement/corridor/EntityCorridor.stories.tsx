import type { Meta, StoryObj } from "@storybook/react-vite";
import EntityCorridor from "./EntityCorridor";
import type { EntityCardItem } from "@@/layout/announcement/entity-card/EntityCard";

const PROFESSIONALS: EntityCardItem[] = [
  { id: "1", name: "Jane Doe", subtitle: "Eletricista", href: "#" },
  { id: "2", name: "John Smith", subtitle: "Instalador", href: "#" },
  { id: "3", name: "Maria Silva", subtitle: "Engenheira", href: "#" },
];

const COMPANIES: EntityCardItem[] = [
  { id: "1", name: "Acme Energia", subtitle: "São Paulo, SP", href: "#" },
  { id: "2", name: "Sol Forte", subtitle: "Curitiba, PR", href: "#" },
];

const meta = {
  title: "Layout/Announcement/EntityCorridor",
  component: EntityCorridor,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof EntityCorridor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Professionals: Story = {
  args: {
    title: "Profissionais credenciados",
    items: PROFESSIONALS,
  },
};

export const Companies: Story = {
  args: {
    title: "Empresas credenciadas",
    items: COMPANIES,
  },
};
