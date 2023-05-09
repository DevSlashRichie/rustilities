export class EmptyElement {}

/**
 * Use this method to create an empty element.
 * Mostly used when an Empty result needs to be returned.
 **/
export function Empty() {
  return new EmptyElement();
}
