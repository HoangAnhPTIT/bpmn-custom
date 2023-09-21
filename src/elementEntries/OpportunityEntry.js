'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('../preact/hooks');
var minDash = require('min-dash');
var compat = require('../preact/compat');
var jsxRuntime = require('../preact/jsx-runtime');
var preact = require('../preact');
var classnames = require('classnames');
var minDom = require('min-dom');
var feelers = require('feelers');
var FeelEditor = require('@bpmn-io/feel-editor');
var view = require('@codemirror/view');
var focusTrap = require('focus-trap');


function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);

function useError(id) {
  const {
    errors
  } = hooks.useContext(ErrorsContext);
  return errors[id];
}

/**
 * @param {object} props
 * @param {object} props.element
 * @param {string} props.id
 * @param {string} [props.description]
 * @param {string} props.label
 * @param {Function} props.getValue
 * @param {Function} props.setValue
 * @param {Function} props.onFocus
 * @param {Function} props.onBlur
 * @param {Function} props.getOptions
 * @param {boolean} [props.disabled]
 * @param {Function} [props.validate]
 * @param {string|import('preact').Component} props.tooltip
 */
function SelectEntry(props) {
  const {
    element,
    id,
    description,
    label,
    getValue,
    setValue,
    getOptions,
    disabled,
    onFocus,
    onBlur,
    validate,
    tooltip
  } = props;
  const options = getOptions(element);
  const globalError = useError(id);
  const [localError, setLocalError] = hooks.useState(null);
  let value = getValue(element);
  hooks.useEffect(() => {
    if (minDash.isFunction(validate)) {
      const newValidationError = validate(value) || null;
      setLocalError(newValidationError);
    }
  }, [value]);
  const onChange = newValue => {
    let newValidationError = null;
    if (minDash.isFunction(validate)) {
      newValidationError = validate(newValue) || null;
    }
    setValue(newValue, newValidationError);
    setLocalError(newValidationError);
  };
  const error = globalError || localError;
  return jsxRuntime.jsxs("div", {
    class: classnames__default["default"]('bio-properties-panel-entry', error ? 'has-error' : ''),
    "data-entry-id": id,
    children: [jsxRuntime.jsx(Select, {
      id: id,
      label: label,
      value: value,
      onChange: onChange,
      onFocus: onFocus,
      onBlur: onBlur,
      options: options,
      disabled: disabled,
      tooltip: tooltip,
      element: element
    }, element), error && jsxRuntime.jsx("div", {
      class: "bio-properties-panel-error",
      children: error
    }), jsxRuntime.jsx(Description, {
      forId: id,
      element: element,
      value: description
    })]
  });
}