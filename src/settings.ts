import "@scss/main.scss";
import boardSizeIcon32Src from "@assets/icons/settings-icons/boardSize-icon-32.png";
import chosenSeparatorSlashSrc from "@assets/icons/settings-icons/choosen-separatorSlash.png";
import choosePlayerIcon32Src from "@assets/icons/settings-icons/choosePlayer-icon-32.png";
import separatorSlashSrc from "@assets/icons/settings-icons/separatorSlash.png";
import themesIcon32Src from "@assets/icons/settings-icons/themes-icon-32.png";
import previewCodeVibesSrc from "@assets/img/themes/code-vibes/preview-codeVibes.png";
import previewFoodThemeSrc from "@assets/img/themes/food-theme/preview-foodTheme.png";
import previewGamingThemeSrc from "@assets/img/themes/gaming-theme/preview-gamingTheme.png";
import {
  settingsGroupTemplate,
  settingsOptionTemplate,
  settingsSeparatorTemplate,
  settingsStepTemplate,
  settingsStepsTemplate,
} from "./settings.templates";
import { DEFAULT_THEME, type GameSettings, writeGameSettings } from "./shared/_game-settings";
import { navigateTo } from "./shared/_navigation";

const CHOSEN_SEPARATOR_SRC = chosenSeparatorSlashSrc;
const DEFAULT_SEPARATOR_SRC = separatorSlashSrc;
const DEFAULT_BOARD_SIZE = 16;
const REQUIRED_GROUP_NAMES = ["theme", "player", "board-size"] as const;

interface SettingsOption {
  id: string;
  name: string;
  value: string;
  label: string;
}

interface SettingsGroup {
  stepLabel: string;
  title: string;
  iconSrc: string;
  options: SettingsOption[];
}

interface SettingsStepItem {
  text: string;
  isActive: boolean;
  separatorSrc?: string;
  separatorActive?: boolean;
}

interface ThemePreview {
  src: string;
  alt: string;
}

const themePreviewByValue: Record<GameSettings["theme"], ThemePreview> = {
  "code-vibes": {
    src: previewCodeVibesSrc,
    alt: "Vorschau des Code Vibes Themes",
  },
  gaming: {
    src: previewGamingThemeSrc,
    alt: "Vorschau des Gaming Themes",
  },
  foods: {
    src: previewFoodThemeSrc,
    alt: "Vorschau des Food Themes",
  },
};

let selectedThemeValue: GameSettings["theme"] = DEFAULT_THEME;

/**
 * Creates Option from the provided inputs.
 * @param id Stable id used for input and label association.
 * @param name Input name used to group options.
 * @param value Raw value used for parsing, validation, or mapping.
 * @param label Human-readable option label.
 * @returns Value of type `SettingsOption`.
 */
function createOption(id: string, name: string, value: string, label: string): SettingsOption {
  return { id, name, value, label };
}

/**
 * Creates Group from the provided inputs.
 * @param stepLabel Fallback step label before selection.
 * @param title Section title text.
 * @param iconSrc Image path for an icon asset.
 * @param options Collection of settings options.
 * @returns Value of type `SettingsGroup`.
 */
function createGroup(stepLabel: string, title: string, iconSrc: string, options: SettingsOption[]): SettingsGroup {
  return { stepLabel, title, iconSrc, options };
}

/**
 * Creates Theme Options from the provided inputs.
 * @returns Array containing generated results.
 */
function createThemeOptions(): SettingsOption[] {
  return [
    createOption("theme-code-vibes", "theme", "code-vibes", "Code Vibes"),
    createOption("theme-gaming", "theme", "gaming", "Gaming"),
    createOption("theme-foods", "theme", "foods", "Foods"),
  ];
}

/**
 * Creates Player Options from the provided inputs.
 * @returns Array containing generated results.
 */
function createPlayerOptions(): SettingsOption[] {
  return [
    createOption("player-blue", "player", "blue", "Blue"),
    createOption("player-orange", "player", "orange", "Orange"),
  ];
}

/**
 * Creates Board Size Options from the provided inputs.
 * @returns Array containing generated results.
 */
function createBoardSizeOptions(): SettingsOption[] {
  return [
    createOption("cards-16", "board-size", "16", "16 cards"),
    createOption("cards-24", "board-size", "24", "24 cards"),
    createOption("cards-36", "board-size", "36", "36 cards"),
  ];
}

/**
 * Creates Theme Group from the provided inputs.
 * @returns Value of type `SettingsGroup`.
 */
function createThemeGroup(): SettingsGroup {
  return createGroup("Game theme", "Game Themes", themesIcon32Src, createThemeOptions());
}

/**
 * Creates Player Group from the provided inputs.
 * @returns Value of type `SettingsGroup`.
 */
function createPlayerGroup(): SettingsGroup {
  return createGroup("Player", "Starting Player", choosePlayerIcon32Src, createPlayerOptions());
}

/**
 * Creates Board Size Group from the provided inputs.
 * @returns Value of type `SettingsGroup`.
 */
function createBoardSizeGroup(): SettingsGroup {
  return createGroup("Board size", "Board size", boardSizeIcon32Src, createBoardSizeOptions());
}

/**
 * Creates Settings Groups from the provided inputs.
 * @returns Array containing generated results.
 */
function createSettingsGroups(): SettingsGroup[] {
  return [createThemeGroup(), createPlayerGroup(), createBoardSizeGroup()];
}

const settingsGroups = createSettingsGroups();

/**
 * Renders Option into the UI.
 * @param option Settings option configuration object.
 * @returns Generated string value for rendering or downstream processing.
 */
function renderOption(option: SettingsOption): string {
  return settingsOptionTemplate(option.id, option.name, option.value, option.label);
}

/**
 * Renders Options into the UI.
 * @param options Collection of settings options.
 * @returns Generated string value for rendering or downstream processing.
 */
function renderOptions(options: SettingsOption[]): string {
  return options.map((option) => renderOption(option)).join("");
}

/**
 * Renders Group into the UI.
 * @param group Settings group configuration object.
 * @returns Generated string value for rendering or downstream processing.
 */
function renderGroup(group: SettingsGroup): string {
  return settingsGroupTemplate(group.title, group.iconSrc, renderOptions(group.options));
}

/**
 * Renders Groups into the UI.
 * @param groups Collection of settings groups.
 * @returns Generated string value for rendering or downstream processing.
 */
function renderGroups(groups: SettingsGroup[]): string {
  return groups.map((group) => renderGroup(group)).join("");
}

/**
 * Returns Group Input Name from the current DOM/state context.
 * @param group Settings group configuration object.
 * @returns Value of type `string`, or `null` when no valid value can be resolved.
 */
function getGroupInputName(group: SettingsGroup): string | null {
  return group.options[0]?.name ?? null;
}

/**
 * Returns Checked Input from the current DOM/state context.
 * @param form Settings form element containing the current selections.
 * @param inputName Input group name attribute.
 * @returns Resolved `HTMLInputElement`, or `null` when no matching element can be resolved.
 */
function getCheckedInput(form: HTMLFormElement, inputName: string): HTMLInputElement | null {
  return form.querySelector<HTMLInputElement>(`input[name="${inputName}"]:checked`);
}

/**
 * Returns Selected Value from the current DOM/state context.
 * @param form Settings form element containing the current selections.
 * @param group Settings group configuration object.
 * @returns Value of type `string`, or `null` when no valid value can be resolved.
 */
function getSelectedValue(form: HTMLFormElement, group: SettingsGroup): string | null {
  const inputName = getGroupInputName(group);
  return inputName ? getCheckedInput(form, inputName)?.value ?? null : null;
}

/**
 * Finds Option Label in the available collection.
 * @param group Settings group configuration object.
 * @param value Raw value used for parsing, validation, or mapping.
 * @returns Value of type `string`, or `null` when no valid value can be resolved.
 */
function findOptionLabel(group: SettingsGroup, value: string): string | null {
  const option = group.options.find((entry) => entry.value === value);
  return option?.label ?? null;
}

/**
 * Returns Selected Label from the current DOM/state context.
 * @param form Settings form element containing the current selections.
 * @param group Settings group configuration object.
 * @returns Value of type `string`, or `null` when no valid value can be resolved.
 */
function getSelectedLabel(form: HTMLFormElement, group: SettingsGroup): string | null {
  const value = getSelectedValue(form, group);
  return value ? findOptionLabel(group, value) : null;
}

/**
 * Checks whether Group Selected is satisfied.
 * @param form Settings form element containing the current selections.
 * @param groupName Required settings group name.
 * @returns `true` when the condition is met; otherwise `false`.
 */
function isGroupSelected(form: HTMLFormElement, groupName: string): boolean {
  return Boolean(getCheckedInput(form, groupName));
}

/**
 * Executes Are All Settings Selected for the current flow.
 * @param form Settings form element containing the current selections.
 * @returns `true` when the condition is met; otherwise `false`.
 */
function areAllSettingsSelected(form: HTMLFormElement): boolean {
  return REQUIRED_GROUP_NAMES.every((groupName) => isGroupSelected(form, groupName));
}

/**
 * Executes Separator Source for the current flow.
 * @param isActive Controls the active state of a UI element.
 * @returns Generated string value for rendering or downstream processing.
 */
function separatorSource(isActive: boolean): string {
  return isActive ? CHOSEN_SEPARATOR_SRC : DEFAULT_SEPARATOR_SRC;
}

/**
 * Creates Step from the provided inputs.
 * @param text Text content to display.
 * @param isActive Controls the active state of a UI element.
 * @param hasSeparator Controls whether a separator is rendered after this step.
 * @returns Value of type `SettingsStepItem`.
 */
function createStep(text: string, isActive: boolean, hasSeparator: boolean): SettingsStepItem {
  if (!hasSeparator) {
    return { text, isActive };
  }

  return { text, isActive, separatorSrc: separatorSource(isActive), separatorActive: isActive };
}

/**
 * Creates Step From Group from the provided inputs.
 * @param form Settings form element containing the current selections.
 * @param group Settings group configuration object.
 * @param hasSeparator Controls whether a separator is rendered after this step.
 * @returns Value of type `SettingsStepItem`.
 */
function createStepFromGroup(form: HTMLFormElement, group: SettingsGroup, hasSeparator: boolean): SettingsStepItem {
  const label = getSelectedLabel(form, group);
  return createStep(label ?? group.stepLabel, Boolean(label), hasSeparator);
}

/**
 * Builds Step Items from current inputs.
 * @param form Settings form element containing the current selections.
 * @returns Array containing generated results.
 */
function buildStepItems(form: HTMLFormElement): SettingsStepItem[] {
  return settingsGroups.map((group, index) => {
    const hasSeparator = index < settingsGroups.length - 1;
    return createStepFromGroup(form, group, hasSeparator);
  });
}

/**
 * Renders Step into the UI.
 * @param item Eingabewert, der in diesem Verarbeitungsschritt verwendet wird.
 * @returns Generated string value for rendering or downstream processing.
 */
function renderStep(item: SettingsStepItem): string {
  const stepMarkup = settingsStepTemplate(item.text, item.isActive);
  return item.separatorSrc
    ? `${stepMarkup}${settingsSeparatorTemplate(item.separatorSrc, Boolean(item.separatorActive))}`
    : stepMarkup;
}

/**
 * Renders Step Items into the UI.
 * @param stepItems Eingabewert, der in diesem Verarbeitungsschritt verwendet wird.
 * @returns Generated string value for rendering or downstream processing.
 */
function renderStepItems(stepItems: SettingsStepItem[]): string {
  return stepItems.map((item) => renderStep(item)).join("");
}

/**
 * Returns Steps Mount from the current DOM/state context.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getStepsMount(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-settings-steps]");
}

/**
 * Renders Settings Steps into the UI.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function renderSettingsSteps(form: HTMLFormElement): void {
  const stepsMount = getStepsMount();

  if (!stepsMount) {
    return;
  }

  const markup = renderStepItems(buildStepItems(form));
  stepsMount.innerHTML = settingsStepsTemplate(markup, areAllSettingsSelected(form));
}

/**
 * Returns Preview Image from the current DOM/state context.
 * @returns Resolved `HTMLImageElement`, or `null` when no matching element can be resolved.
 */
function getPreviewImage(): HTMLImageElement | null {
  return document.querySelector<HTMLImageElement>(".settings__preview-card img");
}

/**
 * Returns Theme Preview from the current DOM/state context.
 * @param themeValue Selected theme value from the settings form.
 * @returns Value of type `ThemePreview`.
 */
function getThemePreview(themeValue: string): ThemePreview {
  if (themeValue === "gaming" || themeValue === "foods" || themeValue === DEFAULT_THEME) {
    return themePreviewByValue[themeValue];
  }

  return themePreviewByValue[DEFAULT_THEME];
}

/**
 * Applies Theme Preview to the current UI context.
 * @param previewImage IMG element used for theme preview rendering.
 * @param preview Theme preview data containing image source and alt text.
 * @returns No return value; this function works via side effects.
 */
function applyThemePreview(previewImage: HTMLImageElement, preview: ThemePreview): void {
  previewImage.src = preview.src;
  previewImage.alt = preview.alt;
}

/**
 * Updates Theme Preview on the target element or state.
 * @param themeValue Selected theme value from the settings form.
 * @returns No return value; this function works via side effects.
 */
function setThemePreview(themeValue: string): void {
  const previewImage = getPreviewImage();

  if (!previewImage) {
    return;
  }

  applyThemePreview(previewImage, getThemePreview(themeValue));
}

/**
 * Returns Selected Theme Value from the current DOM/state context.
 * @param form Settings form element containing the current selections.
 * @returns Value of type `GameSettings["theme"]`.
 */
function getSelectedThemeValue(form: HTMLFormElement): GameSettings["theme"] {
  const value = getCheckedInput(form, "theme")?.value;
  if (value === "gaming" || value === "foods") {
    return value;
  }

  return DEFAULT_THEME;
}

/**
 * Returns Selected Player Value from the current DOM/state context.
 * @param form Settings form element containing the current selections.
 * @returns Value of type `GameSettings["player"]`.
 */
function getSelectedPlayerValue(form: HTMLFormElement): GameSettings["player"] {
  return getCheckedInput(form, "player")?.value === "orange" ? "orange" : "blue";
}

/**
 * Returns Selected Board Size from the current DOM/state context.
 * @param form Settings form element containing the current selections.
 * @returns Computed numeric value.
 */
function getSelectedBoardSize(form: HTMLFormElement): number {
  const value = getCheckedInput(form, "board-size")?.value;
  const parsed = Number.parseInt(value ?? String(DEFAULT_BOARD_SIZE), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_BOARD_SIZE;
}

/**
 * Builds a validated `GameSettings` object from form selections.
 * @param form Settings form element containing the current selections.
 * @returns Value of type `GameSettings`.
 */
function buildGameSettings(form: HTMLFormElement): GameSettings {
  return {
    theme: getSelectedThemeValue(form),
    player: getSelectedPlayerValue(form),
    boardSize: getSelectedBoardSize(form),
  };
}

/**
 * Persists the current settings for the game page.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function persistGameSettings(form: HTMLFormElement): void {
  writeGameSettings(buildGameSettings(form));
}

/**
 * Executes Sync Theme Preview To Selection for the current flow.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function syncThemePreviewToSelection(form: HTMLFormElement): void {
  selectedThemeValue = getSelectedThemeValue(form);
  setThemePreview(selectedThemeValue);
}

/**
 * Binds event handlers for Theme Hover.
 * @param optionElement Interactive option element in the settings UI.
 * @param input Input element used in the current operation.
 * @returns No return value; this function works via side effects.
 */
function bindThemeHover(optionElement: HTMLElement, input: HTMLInputElement): void {
  optionElement.addEventListener("mouseenter", () => setThemePreview(input.value));
  optionElement.addEventListener("mouseleave", () => setThemePreview(selectedThemeValue));
}

/**
 * Initializes Theme Preview Hover for first use.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function initThemePreviewHover(form: HTMLFormElement): void {
  const themeInputs = form.querySelectorAll<HTMLInputElement>('input[name="theme"]');

  themeInputs.forEach((input) => {
    const optionElement = input.closest<HTMLElement>(".settings__option");
    if (optionElement) {
      bindThemeHover(optionElement, input);
    }
  });
}

/**
 * Handles events for Settings Change.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function onSettingsChange(form: HTMLFormElement): void {
  syncThemePreviewToSelection(form);
  renderSettingsSteps(form);
}

/**
 * Renders Form into the UI.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function renderForm(form: HTMLFormElement): void {
  form.innerHTML = renderGroups(settingsGroups);
}

/**
 * Binds event handlers for Form Change.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function bindFormChange(form: HTMLFormElement): void {
  form.addEventListener("change", () => onSettingsChange(form));
}

/**
 * Returns Start Button From Event from the current DOM/state context.
 * @param event DOM event triggered by the current user interaction.
 * @returns Resolved `HTMLButtonElement`, or `null` when no matching element can be resolved.
 */
function getStartButtonFromEvent(event: MouseEvent): HTMLButtonElement | null {
  if (!(event.target instanceof HTMLElement)) {
    return null;
  }

  return event.target.closest<HTMLButtonElement>(".settings__start-button");
}

/**
 * Checks whether start is allowed with the current selection state.
 * @param startButton Start button resolved from the click event.
 * @param form Settings form element containing the current selections.
 * @returns `true` when the condition is met; otherwise `false`.
 */
function canStartGameNavigation(startButton: HTMLButtonElement | null, form: HTMLFormElement): boolean {
  if (!startButton || startButton.disabled) {
    return false;
  }

  return areAllSettingsSelected(form);
}

/**
 * Handles start-button clicks including validation and navigation.
 * @param event DOM event triggered by the current user interaction.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function onStartButtonClick(event: MouseEvent, form: HTMLFormElement): void {
  const startButton = getStartButtonFromEvent(event);
  if (!canStartGameNavigation(startButton, form)) {
    return;
  }

  persistGameSettings(form);
  navigateTo("game");
}

/**
 * Binds event handlers for Start Navigation Click.
 * @param stepsMount Mount element that renders steps and start button.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function bindStartNavigationClick(stepsMount: HTMLElement, form: HTMLFormElement): void {
  stepsMount.addEventListener("click", (event: MouseEvent) => onStartButtonClick(event, form));
}

/**
 * Binds event handlers for Start Navigation.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function bindStartNavigation(form: HTMLFormElement): void {
  const stepsMount = getStepsMount();
  if (!stepsMount) {
    return;
  }

  bindStartNavigationClick(stepsMount, form);
}

/**
 * Updates Up Settings Form on the target element or state.
 * @param form Settings form element containing the current selections.
 * @returns No return value; this function works via side effects.
 */
function setupSettingsForm(form: HTMLFormElement): void {
  renderForm(form);
  initThemePreviewHover(form);
  onSettingsChange(form);
  bindFormChange(form);
  bindStartNavigation(form);
}

/**
 * Returns Settings Form from the current DOM/state context.
 * @returns Resolved `HTMLFormElement`, or `null` when no matching element can be resolved.
 */
function getSettingsForm(): HTMLFormElement | null {
  return document.querySelector<HTMLFormElement>("[data-settings-form]");
}

/**
 * Bootstraps and wires the settings form on page load.
 * @returns No return value; this function works via side effects.
 */
function mountSettingsForm(): void {
  const settingsForm = getSettingsForm();
  if (settingsForm) {
    setupSettingsForm(settingsForm);
  }
}

mountSettingsForm();
