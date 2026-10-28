import type { ImageSource } from 'expo-image';

// Icons exported from Figma. Each colour variant is its own file, as in the design.
export const icons = {
  romrStar: require('@/assets/icons/planner/romr-star.svg'),
  caretDown: require('@/assets/icons/planner/caret-down.svg'),
  caretLeft: require('@/assets/icons/planner/caret-left.svg'),
  check: require('@/assets/icons/planner/check.svg'),
  plusWhite16: require('@/assets/icons/planner/plus-white-16.svg'),
  plus24: require('@/assets/icons/planner/plus-24.svg'),
  usersWhite: require('@/assets/icons/planner/users-white.svg'),
  usersDark: require('@/assets/icons/planner/users-dark.svg'),
  paperPlaneTiltWhite: require('@/assets/icons/planner/paper-plane-tilt-white.svg'),
  list: require('@/assets/icons/planner/list.svg'),
  mapPin: require('@/assets/icons/planner/map-pin.svg'),
  calendarBlank: require('@/assets/icons/planner/calendar-blank.svg'),
  sparkleDark: require('@/assets/icons/planner/sparkle-dark.svg'),
  sparkleWhite: require('@/assets/icons/planner/sparkle-white.svg'),
  building: require('@/assets/icons/planner/building.svg'),
  stepCurrent: require('@/assets/icons/planner/step-current.svg'),
  stepUpcoming: require('@/assets/icons/planner/step-upcoming.svg'),
  microphone: require('@/assets/icons/planner/microphone.svg'),
  dotDark: require('@/assets/icons/planner/dot-dark.svg'),
  dotGray: require('@/assets/icons/planner/dot-gray.svg'),
  dotLight: require('@/assets/icons/planner/dot-light.svg'),
} satisfies Record<string, ImageSource>;

export const photos = {
  tokyo: require('@/assets/images/planner/tokyo.jpg'),
  banff: require('@/assets/images/planner/banff.jpg'),
  fifa: require('@/assets/images/planner/fifa.jpg'),
  calgary: require('@/assets/images/planner/calgary.jpg'),
  itinerary3: require('@/assets/images/planner/itinerary-3.jpg'),
  itinerary4: require('@/assets/images/planner/itinerary-4.png'),
} satisfies Record<string, ImageSource>;
