import type { Meta, StoryObj } from "@storybook/react-vite";
import EntityCard, { type EntityCardItem } from "./EntityCard";

const item: EntityCardItem = {
  id: "1",
  name: "Jane Doe",
  subtitle: "Eletricista",
  href: "#",
};

const meta = {
  title: "Layout/Announcement/EntityCard",
  component: EntityCard,
  parameters: {
    layout: "centered",
  },
  args: {
    item,
    className: "w-40",
  },
} satisfies Meta<typeof EntityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSubtitle: Story = {
  args: { item: { ...item, subtitle: undefined } },
};

export const WithoutAvatar: Story = {
  args: { item: { ...item, avatarUrl: undefined } },
};
