import type { Meta, StoryObj } from "@storybook/react-vite";
import OperationalTable from "./OperationalTable.js";

const meta = {
  title: "Layout/OperationalPage/Table",
  component: OperationalTable,
  args: { label: "Itens", columns: [], items: [], getKey: (item: unknown) => String(item), empty: "Nenhum item" },
} satisfies Meta<typeof OperationalTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <OperationalTable
      label="Itens"
      items={["Primeiro", "Segundo", "Terceiro", "Quarto", "Quinto", "Sexto"]}
      columns={[{ key: "name", label: "Nome", render: (item: string) => item }]}
      getKey={(item) => item}
      empty="Nenhum item"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <OperationalTable<string>
      label="Itens"
      items={null}
      columns={[{ key: "name", label: "Nome", render: (item) => item }]}
      getKey={(item) => item}
      empty="Nenhum item"
    />
  ),
};
