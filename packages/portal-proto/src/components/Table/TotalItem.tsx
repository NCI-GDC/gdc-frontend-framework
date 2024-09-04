import React from "react";

interface TotalItemsProps {
  /**
   * The total number of items to display.
   * Can be null or undefined if the count is not available.
   */
  total: number | null | undefined;

  /**
   * The singular name of the item (e.g., "cart item", "product", "category").
   * This will be used when the total is 1 or when constructing the default plural.
   */
  itemName: string;

  /**
   * Optional. The plural name of the item.
   * Use this when the plural form is irregular (e.g., "children" for "child")
   * or when you want to provide a custom plural form.
   * If not provided, the component will append 's' to itemName for the plural.
   */
  pluralName?: string;
}

const TotalItems: React.FC<TotalItemsProps> = ({
  total,
  itemName,
  pluralName,
}) => {
  const formattedTotal = total?.toLocaleString() ?? "...";
  const itemText = total === 1 ? itemName : pluralName ?? `${itemName}s`;

  return (
    <>
      Total of <b data-testid="text-total-item-count">{formattedTotal}</b>{" "}
      {itemText}
    </>
  );
};

export default TotalItems;
