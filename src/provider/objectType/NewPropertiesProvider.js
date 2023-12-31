// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import spellProps from './parts';

const LOW_PRIORITY = 500;
import { is } from 'bpmn-js/lib/util/ModelUtil'

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function NewPropertiesProvider(propertiesPanel, translate) {

  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function (element) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {

      // Add the "magic" group
      if (is(element, 'bpmn:Task')) {
        groups.push(createMagicGroup(element, translate));
      }

      return groups;
    }
  };


  // registration ////////

  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

NewPropertiesProvider.$inject = ['propertiesPanel', 'translate'];

// Create the custom magic group
function createMagicGroup(element, translate) {

  // create a group called "Magic properties".
  const magicGroup = {
    id: 'object',
    label: translate('Đối tượng'),
    entries: spellProps(element)
  };

  return magicGroup
}
