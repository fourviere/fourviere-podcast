import tw from "tailwind-styled-components";

export const H1 = tw.span`text-xl leading-none`;
export const H2 = tw.span`text-lg leading-none`;
export const H3 = tw.span`text text-slate-600`;
export const H1Link = tw.a`text-xl hover:underline hover:text-rose-600 font-semibold cursor-pointer`;

export const Title = tw.div`text-xl font-semibold leading-1`;

export const P = tw.p<{ $lineClamp?: number }>`text-sm ${(p) =>
  p.$lineClamp === 1 ? `line-clamp-1` : ``}
  ${(p) => (p.$lineClamp === 2 ? `line-clamp-2 ` : ``)}
  ${(p) => (p.$lineClamp === 3 ? `line-clamp-3 ` : ``)}
  ${(p) => (p.$lineClamp === 4 ? `line-clamp-4 ` : ``)}
  ${(p) => (p.$lineClamp === 5 ? `line-clamp-5` : ``)}`;
export const Note = tw.p`text-xs text-slate-400`;
export const Label = tw.p`text-xs text-slate-700`;
