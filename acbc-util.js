/**
 * acbc-util.js
 * 
 * @file
 *   Utility functions and properties
 * @author   Alice Churchfield
 */



const ACBC_VERSION = document.currentScript?.dataset.version;
if (!ACBC_VERSION)
  console.warn("Running acbc-util.js outside of acbc.js");



console.log(" * acbc-util.js loaded.");
