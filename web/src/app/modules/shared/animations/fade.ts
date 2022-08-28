import { animate, animation, state, style, transition, trigger, useAnimation } from "@angular/animations";

export const fadeInTransition =
  transition('void => *', [
    style({ opacity: '0' }),
    animate('0.5s ease-out', style({ opacity: '1' }))
  ])


export const fadeOutTransition =
  transition('* => void', [
    animate('0.5s ease-out', style({ opacity: '0' }))
  ])


export const fadeInOut = [
  fadeInTransition,
  fadeOutTransition
]

export const fadeInOutTrigger = trigger('fadeInOut', [
  ...fadeInOut
])
