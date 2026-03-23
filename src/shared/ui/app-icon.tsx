import add24Filled from "@iconify-icons/fluent/add-24-filled";
import arrowSquareUpRight20Regular from "@iconify-icons/fluent/arrow-square-up-right-20-regular";
import calendar20Regular from "@iconify-icons/fluent/calendar-20-regular";
import comment20Regular from "@iconify-icons/fluent/comment-20-regular";
import dismiss20Regular from "@iconify-icons/fluent/dismiss-20-regular";
import personArrowLeft20Regular from "@iconify-icons/fluent/person-arrow-left-20-regular";
import personArrowRight20Regular from "@iconify-icons/fluent/person-arrow-right-20-regular";
import heart20Regular from "@iconify-icons/fluent/heart-20-regular";
import home24Regular from "@iconify-icons/fluent/home-24-regular";
import key20Filled from "@iconify-icons/fluent/key-20-filled";
import personCircle20Regular from "@iconify-icons/fluent/person-circle-20-regular";
import search20Regular from "@iconify-icons/fluent/search-20-regular";
import send20Filled from "@iconify-icons/fluent/send-20-filled";
import share20Regular from "@iconify-icons/fluent/share-20-regular";
import sparkle20Regular from "@iconify-icons/fluent/sparkle-20-regular";
import alert20Regular from "@iconify-icons/fluent/alert-20-regular";
import image20Regular from "@iconify-icons/fluent/image-20-regular";

const iconMap = {
  author: personCircle20Regular,
  calendar: calendar20Regular,
  compose: add24Filled,
  dismiss: dismiss20Regular,
  home: home24Regular,
  open: arrowSquareUpRight20Regular,
  password: key20Filled,
  reaction: heart20Regular,
  reply: comment20Regular,
  search: search20Regular,
  send: send20Filled,
  share: share20Regular,
  signIn: personArrowLeft20Regular,
  signOut: personArrowRight20Regular,
  sparkle: sparkle20Regular,
  notification: alert20Regular,
  image: image20Regular,
} as const;

export type AppIconName = keyof typeof iconMap;

type AppIconProps = {
  class?: string;
  label?: string;
  name: AppIconName;
  testName?: AppIconName;
};

export function AppIcon(props: AppIconProps) {
  const icon = iconMap[props.name];
  const dataName = props.testName ?? props.name;
  const viewBox = `0 0 ${icon.width ?? 24} ${icon.height ?? 24}`;

  return (
    <span class={`inline-flex shrink-0 align-middle ${props.class ?? ""}`} data-app-icon={dataName}>
      <svg
        aria-hidden={props.label ? undefined : true}
        aria-label={props.label}
        class="size-[1em] fill-current"
        role={props.label ? "img" : undefined}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        innerHTML={icon.body}
      />
    </span>
  );
}
