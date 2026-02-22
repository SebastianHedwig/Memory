const START_ICON_SRC = "./src/assets/icons/start-arrow-field.png";

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

export function settingsStepTemplate(text: string, isActive: boolean): string {
  const stepClass = `settings__step${isActive ? " settings__step--active" : ""}`;
  return /*html*/ `<span class="${stepClass}">${text}</span>`;
}

export function settingsSeparatorTemplate(separatorSrc: string, isActive: boolean): string {
  const separatorClass = `settings__separator${isActive ? " settings__separator--active" : ""}`;
  return /*html*/ `<img class="${separatorClass}" src="${separatorSrc}" alt="" aria-hidden="true">`;
}

export function settingsStepsTemplate(renderedSteps: string, isStartEnabled: boolean): string {
  return /*html*/ `
    <nav class="settings__steps" aria-label="Settings navigation">
      ${renderedSteps}
      <button class="settings__start-button button button--primary" type="button"${isStartEnabled ? "" : " disabled"}>
        <img class="settings__start-icon" src="${START_ICON_SRC}" alt="" aria-hidden="true">
        Start
      </button>
    </nav>`;
}
