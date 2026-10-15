import type { Meta, StoryObj } from "@storybook/react-vite";
import Hyperlink from "./Hyperlink.js";
import { HyperlinkUrlType } from "./Hyperlink.enum.js";

const meta = {
  title: "UI/Hyperlink",
  component: Hyperlink,
  parameters: {
    layout: "centered",
  },
  args: {
    content: "Saiba mais",
    url: "/",
  },
} satisfies Meta<typeof Hyperlink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Concat: Story = {
  args: { url: "sobre", type: HyperlinkUrlType.CONCAT },
};
