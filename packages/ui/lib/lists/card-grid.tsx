import { PropsWithChildren } from "react";
import ImageComponent from "../image";

type CardGridProps = {
  title: string;
};
const CardGrid = ({ children }: PropsWithChildren<CardGridProps>) => {
  return (
    <div className="h-fulloverflow-y-auto overflow-x-hidden p-6">
      <ul className="xs:grid-cols-2 grid gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
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
  <div className="items-list-item mr-1 h-full w-full cursor-pointer overflow-hidden rounded-lg border border-slate-100 bg-white bg-opacity-60 text-xs text-slate-700 shadow transition-all duration-300 hover:bg-slate-700 hover:text-slate-100 hover:shadow-lg">
    {image && <ImageComponent src={image} className="min-h-32 w-full" />}

    <div className=" overflow-hidden p-3">{title}</div>
  </div>
);
