import startIconSrc from "@assets/icons/start-arrow-field.png";

/**
 * Updates Settings Option Template on the target element or state.
 * @param id Stable id used for input and label association.
 * @param name Input name used to group options.
 * @param value Raw value used for parsing, validation, or mapping.
 * @param label Human-readable option label.
 * @returns Generated string value for rendering or downstream processing.
 */
export function settingsOptionTemplate(id: string, name: string, value: string, label: string): string {
  return /*html*/ `
      <li class="settings__option">
        <input class="settings__option-input" id="${id}" name="${name}" type="radio" value="${value}">
        <label class="settings__option-label" for="${id}">
          <span class="settings__option-radio" aria-hidden="true"></span>
          <span class="settings__option-text">${label}</span>
          <span class="settings__option-line" aria-hidden="true"></span>
        </label>
      </li>`;
}

/**
 * Updates Settings Group Template on the target element or state.
 * @param title Section title text.
 * @param iconSrc Image path for an icon asset.
 * @param optionsMarkup Input value used in this processing step.
 * @returns Generated string value for rendering or downstream processing.
 */
export function settingsGroupTemplate(title: string, iconSrc: string, optionsMarkup: string): string {
  return /*html*/ `
      <fieldset class="settings__group">
        <legend class="settings__group-title">
          <img class="settings__group-icon" src="${iconSrc}" alt="" aria-hidden="true">
          ${title}
        </legend>
        <ul class="settings__options">
          ${optionsMarkup}
        </ul>
      </fieldset>`;
}

/**
 * Updates Settings Step Template on the target element or state.
 * @param text Text content to display.
 * @param isActive Controls the active state of a UI element.
 * @returns Generated string value for rendering or downstream processing.
 */
export function settingsStepTemplate(text: string, isActive: boolean): string {
  const stepClass = `settings__step${isActive ? " settings__step--active" : ""}`;
  return /*html*/ `<span class="${stepClass}">${text}</span>`;
}

/**
 * Updates Settings Separator Template on the target element or state.
 * @param separatorSrc Image path for a step separator.
 * @param isActive Controls the active state of a UI element.
 * @returns Generated string value for rendering or downstream processing.
 */
export function settingsSeparatorTemplate(separatorSrc: string, isActive: boolean): string {
  const separatorClass = `settings__separator${isActive ? " settings__separator--active" : ""}`;
  return /*html*/ `<img class="${separatorClass}" src="${separatorSrc}" alt="" aria-hidden="true">`;
}

/**
 * Updates Settings Steps Template on the target element or state.
 * @param renderedSteps Pre-rendered HTML markup for step items.
 * @param isStartEnabled Controls whether the start button is enabled.
 * @returns Generated string value for rendering or downstream processing.
 */
export function settingsStepsTemplate(renderedSteps: string, isStartEnabled: boolean): string {
  return /*html*/ `
    <div class="settings__steps" role="group" aria-label="Settings progress and start action">
      ${renderedSteps}
      <button class="settings__start-button button button--primary" type="button"${isStartEnabled ? "" : " disabled"}>
        <img class="settings__start-icon" src="${startIconSrc}" alt="" aria-hidden="true">
        Start
      </button>
    </div>`;
}

