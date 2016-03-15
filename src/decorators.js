import {metadata} from "aurelia-metadata";

// symbols for tracking metadata
/* global Symbol */
export const beforeTypes = Symbol();
export const afterTypes = Symbol();

/**
* A decorator that indicates types that should come before
*/
export function before( ...types ) {
  return function( target ) {
    metadata.define( beforeTypes, types, target );
  };
}

/**
* A decorator that indicates that a type follows another type
*/
export function after( ...types ) {
  return function( target ) {
    metadata.define( afterTypes, types, target );
  };
}
