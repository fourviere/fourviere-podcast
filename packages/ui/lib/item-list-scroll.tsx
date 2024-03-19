import React from "react";

interface ItemListProps<Item> {
  items?: Item[];
  elementsPerPage: number;
  itemElement: React.ElementType;
  keyProperty: keyof Item;
  labels: {
    noEpisodes: string;
  };
}

const ItemListScroll = <T extends Record<string, unknown>>({
  items,
  itemElement,
  labels,
}: ItemListProps<T>) => {
  const Item = itemElement;

  return (
    <div className="relative h-full space-y-3 rounded-lg bg-slate-100 p-3">
      {items?.map((item) => <Item {...item}></Item>)}

      {!items || items.length === 0 ? (
        <div className="w-full p-3 text-center text-sm font-semibold  text-slate-500">
          {labels.noEpisodes}
        </div>
      ) : null}
    </div>
  );
};

export default ItemListScroll;
