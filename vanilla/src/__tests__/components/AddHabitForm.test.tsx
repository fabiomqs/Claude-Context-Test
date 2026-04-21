import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddHabitForm } from "@/components/habits/AddHabitForm";

function setup(onAdd = vi.fn()) {
  const user = userEvent.setup();
  render(<AddHabitForm onAdd={onAdd} />);
  return { user, onAdd };
}

describe("AddHabitForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renderiza input e botão Adicionar", () => {
    setup();
    expect(screen.getByPlaceholderText("Novo hábito...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });

  it("botão desabilitado quando input está vazio", () => {
    setup();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
  });

  it("botão habilitado após digitar texto", async () => {
    const { user } = setup();
    await user.type(screen.getByPlaceholderText("Novo hábito..."), "Correr");
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeEnabled();
  });

  it("chama onAdd com nome trimado e cor padrão emerald ao submeter", async () => {
    const { user, onAdd } = setup();
    await user.type(screen.getByPlaceholderText("Novo hábito..."), "  Correr  ");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(onAdd).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledWith("Correr", "emerald");
  });

  it("reseta o input após submit bem-sucedido", async () => {
    const { user } = setup();
    const input = screen.getByPlaceholderText("Novo hábito...");
    await user.type(input, "Meditar");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(input).toHaveValue("");
  });

  it("não chama onAdd para input só de espaços", async () => {
    const { user, onAdd } = setup();
    await user.type(screen.getByPlaceholderText("Novo hábito..."), "   ");
    // botão ainda estará desabilitado pois trim() resulta em string vazia
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("submete ao pressionar Enter", async () => {
    const { user, onAdd } = setup();
    await user.type(screen.getByPlaceholderText("Novo hábito..."), "Ler{Enter}");
    expect(onAdd).toHaveBeenCalledWith("Ler", "emerald");
  });

  it("clicar em swatch de cor altera a cor selecionada", async () => {
    const { user, onAdd } = setup();
    await user.click(screen.getByLabelText("violet"));
    await user.type(screen.getByPlaceholderText("Novo hábito..."), "Yoga");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(onAdd).toHaveBeenCalledWith("Yoga", "violet");
  });
});
