import {metadata} from "aurelia-metadata";

// symbols for tracking metadata
/* global Symbol */
export const followsTypes = Symbol();
export const precedesTypes = Symbol();

/**
* A decorator that indicates that a type follows another type
*/
export function follows( ...types ) {
  return function( target ) {
    metadata.define( followsTypes, types, target );
  };
}

/**
* A decorator that indicates that a type follows another type
*/
export function precedes( ...types ) {
  return function( target ) {
    metadata.define( precedesTypes, types, target );
  };
}
