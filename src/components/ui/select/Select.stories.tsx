import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";
import { DefaultSelect, BooleanSelect } from "./Select.presets";

const DEMO_OPTIONS = ["Small", "Medium", "Large"];

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "size",
    options: DEMO_OPTIONS,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <DefaultSelect {...args} />,
};

export const Rounded: Story = {
  args: { rounded: true },
  render: (args) => <DefaultSelect {...args} />,
};

export const WithDefaultValue: Story = {
  args: { defaultValue: DEMO_OPTIONS[0] },
  render: (args) => <DefaultSelect {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <DefaultSelect {...args} />,
};

export const Boolean: Story = {
  args: { name: "active" },
  render: () => <BooleanSelect name="active" />,
};
