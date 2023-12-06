import { PropsWithChildren } from "react";

type CardGridProps = {
  title: string;
};
const CardGrid = ({ children }: PropsWithChildren<CardGridProps>) => {
  return (
    <div className="h-fulloverflow-y-auto overflow-x-hidden p-6">
      <ul className="grid gap-2 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
        {children}
      </ul>
    </div>
  );
};

export default CardGrid;

type CardGridItemProps = {
  image?: string;
  title: string;
};

export const Card = ({ image, title }: CardGridItemProps) => (
  <div className="items-list-item text-xs h-full bg-white bg-opacity-60 w-full text-slate-700 hover:bg-slate-700 shadow hover:shadow-lg hover:text-slate-100 cursor-pointer rounded-lg overflow-hidden mr-1 border border-slate-100 transition-all duration-300">
    {image && <img src={image} className="" />}

    <div className=" overflow-hidden p-3">{title}</div>
  </div>
);
