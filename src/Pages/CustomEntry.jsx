import { html } from 'htm/preact';
import * as hooks from 'preact/hooks'
import * as minDash from 'min-dash';
// import compat = require('../preact/compat');
import * as jsxRuntime from 'preact/jsx-runtime';
// import preact = require('../preact');
import classnames from 'classnames';
import { SelectEntry } from '@bpmn-io/properties-panel';

// import minDom = require('min-dom');
// import feelers = require('feelers');
// import FeelEditor = require('@bpmn-io/feel-editor');
// import view = require('@codemirror/view');
// import focusTrap = require('focus-trap');


function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);

export default function CustomEntry(props) {
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
    tooltip,
    childs
  } = props;
  const options = getOptions(element);
  // const globalError = useError(id);
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
  // const error = globalError || localError;
  const error = localError;

  return jsxRuntime.jsxs("div", {
    class: classnames__default["default"]('bio-properties-panel-entry', error ? 'has-error' : ''),
    "data-entry-id": id,
    children: [jsxRuntime.jsx(SelectEntry, {
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
    })]
  });
}
