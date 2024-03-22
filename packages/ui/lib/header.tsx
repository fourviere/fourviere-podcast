import HStack from "./layouts/h-stack";
import VStack from "./layouts/v-stack";
import { H3, Title } from "./typography";

interface HeaderProps {
  title: string;
  subtitle: string;
  bigImageUrl?: string;
  smallImageUrl?: string;
}
export default function Header({
  title,
  subtitle,
  bigImageUrl,
  smallImageUrl,
}: HeaderProps) {
  return (
    <div className="sticky top-0 bg-white p-5">
      <HStack spacing="5" alignItems="center">
        <div className="relative shrink-0">
          <img className="h-20 rounded-lg" src={bigImageUrl} />
          <img
            className="absolute -bottom-1 -right-3 h-8 w-8 rounded-md border-2 border-slate-100"
            src={smallImageUrl}
          />
        </div>
        <VStack>
          <Title>{title}</Title>
          <H3>{subtitle}</H3>
        </VStack>
      </HStack>
    </div>
  );
}
