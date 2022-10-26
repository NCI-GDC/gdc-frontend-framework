import { render, waitFor } from "@testing-library/react";
import { TraversableList } from "../TraversableList";
import userEvent from "@testing-library/user-event";

describe("<TraversableList />", () => {
  const mockOnSelectItem = jest.fn();
  it("should display No results found when array is empty", () => {
    const { getByText } = render(
      <TraversableList
        data={[]}
        keyExtractor={jest.fn()}
        renderItem={jest.fn()}
      />,
    );
    expect(getByText("No results found")).toBeInTheDocument();
  });

  it("should display List when array is not empty", () => {
    const data = [
      { elem: "hi", id: "1" },
      { elem: "hola", id: "2" },
    ];
    const { queryByText, getByText } = render(
      <TraversableList
        data={data}
        keyExtractor={({ id }) => id}
        renderItem={(item) => <h1>{item.elem}</h1>}
      />,
    );
    expect(queryByText("No results found")).toBe(null);
    expect(getByText("hi")).toBeInTheDocument();
    expect(getByText("hola")).toBeInTheDocument();
  });

  it("should traversable using keyboard keys", async () => {
    const data = [
      { elem: "hi", id: "1" },
      { elem: "hola", id: "2" },
      { elem: "hej", id: "3" },
    ];
    const { getByTestId, getAllByTestId } = render(
      <TraversableList
        data={data}
        keyExtractor={({ id }) => id}
        renderItem={(item) => <h1>{item.elem}</h1>}
        onSelectItem={mockOnSelectItem}
      />,
    );

    const listcomp = getByTestId("list");
    const listElems = getAllByTestId("list-item");
    listcomp.focus();
    await userEvent.keyboard("{Tab}");

    await waitFor(() => expect(listElems[0]).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(listElems[1]).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(listElems[2]).toHaveFocus());

    await userEvent.keyboard("{ArrowUp}");
    await waitFor(() => expect(listElems[1]).toHaveFocus());

    await userEvent.keyboard("{ArrowUp}");
    await waitFor(() => expect(listElems[0]).toHaveFocus());

    // should still be selected once reached the top of the list
    await userEvent.keyboard("{ArrowUp}");
    await waitFor(() => expect(listElems[0]).toHaveFocus());

    await userEvent.keyboard("{Enter}");
    expect(mockOnSelectItem).toBeCalledWith(0);
  });
});
