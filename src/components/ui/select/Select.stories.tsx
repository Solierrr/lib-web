import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select.js";
import { DefaultSelect, BooleanSelect } from "./Select.presets.js";
const modelTypes = ["Monocristalino", "Policristalino", "Filme fino"];

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "type",
    options: modelTypes,
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
  args: { defaultValue: "Policristalino" },
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
