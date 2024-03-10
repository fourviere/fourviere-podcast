import tw from "tailwind-styled-components";

export const HalfPageBox = tw.div`${(p: { responsive?: boolean }) =>
  p.responsive ? "sm:w-full md:w-1/2" : "w-1/2"}`;
export const OneThirdPageBox = tw.div`${(p: { responsive?: boolean }) =>
  p.responsive ? "sm:w-full md:w-1/3" : "w-1/3"}`;
export const TwoThirdsPageBox = tw.div`${(p: { responsive?: boolean }) =>
  p.responsive ? "sm:w-full md:w-2/3" : "w-2/3"}`;
export const OneQuarterPageBox = tw.div`${(p: { responsive?: boolean }) =>
  p.responsive ? "sm:w-full md:w-1/4" : "w-1/4"}`;
export const ThreeQuartersPageBox = tw.div`${(p: { responsive?: boolean }) =>
  p.responsive ? "sm:w-full md:w-3/4" : "w-3/4"}`;
export const FullPageBox = tw.div`w-full`;
