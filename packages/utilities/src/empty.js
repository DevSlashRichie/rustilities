"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empty = exports.EmptyElement = void 0;
class EmptyElement {}
exports.EmptyElement = EmptyElement;
function Empty() {
  return new EmptyElement();
}
exports.Empty = Empty;
