import "@scss/main.scss";
import {
  settingsGroupTemplate,
  settingsOptionTemplate,
  settingsSeparatorTemplate,
  settingsStepTemplate,
  settingsStepsTemplate,
} from "./settings.templates";
import { navigateTo } from "./shared/_navigation";

const CHOSEN_SEPARATOR_SRC = "./src/assets/icons/settings-icons/choosen-separatorSlash.png";
const DEFAULT_SEPARATOR_SRC = "./src/assets/icons/settings-icons/separatorSlash.png";
const DEFAULT_THEME_VALUE = "code-vibes";
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

const themePreviewByValue: Record<string, ThemePreview> = {
  [DEFAULT_THEME_VALUE]: {
    src: "./src/assets/img/themes/code-vibes/preview-codeVibes.png",
    alt: "Vorschau des Code Vibes Themes",
  },
  gaming: {
    src: "./src/assets/img/themes/gaming-theme/preview-gamingTheme.png",
    alt: "Vorschau des Gaming Themes",
  },
  foods: {
    src: "./src/assets/img/themes/food-theme/preview-foodTheme.png",
    alt: "Vorschau des Food Themes",
  },
};

let selectedThemeValue = DEFAULT_THEME_VALUE;

function createOption(id: string, name: string, value: string, label: string): SettingsOption {
  return { id, name, value, label };
}

function createGroup(stepLabel: string, title: string, iconSrc: string, options: SettingsOption[]): SettingsGroup {
  return { stepLabel, title, iconSrc, options };
}

function createThemeOptions(): SettingsOption[] {
  return [
    createOption("theme-code-vibes", "theme", "code-vibes", "Code Vibes"),
    createOption("theme-gaming", "theme", "gaming", "Gaming"),
    createOption("theme-foods", "theme", "foods", "Foods"),
  ];
}

function createPlayerOptions(): SettingsOption[] {
  return [
    createOption("player-blue", "player", "blue", "Blue"),
    createOption("player-orange", "player", "orange", "Orange"),
  ];
}

function createBoardSizeOptions(): SettingsOption[] {
  return [
    createOption("cards-16", "board-size", "16", "16 cards"),
    createOption("cards-24", "board-size", "24", "24 cards"),
    createOption("cards-36", "board-size", "36", "36 cards"),
  ];
}

function createThemeGroup(): SettingsGroup {
  return createGroup("Game theme", "Game Themes", "./src/assets/icons/settings-icons/themes-icon-32.png", createThemeOptions());
}

function createPlayerGroup(): SettingsGroup {
  return createGroup("Player", "Starting Player", "./src/assets/icons/settings-icons/choosePlayer-icon-32.png", createPlayerOptions());
}

function createBoardSizeGroup(): SettingsGroup {
  return createGroup("Board size", "Board size", "./src/assets/icons/settings-icons/boardSize-icon-32.png", createBoardSizeOptions());
}

function createSettingsGroups(): SettingsGroup[] {
  return [createThemeGroup(), createPlayerGroup(), createBoardSizeGroup()];
}

const settingsGroups = createSettingsGroups();

function renderOption(option: SettingsOption): string {
  return settingsOptionTemplate(option.id, option.name, option.value, option.label);
}

function renderOptions(options: SettingsOption[]): string {
  return options.map((option) => renderOption(option)).join("");
}

function renderGroup(group: SettingsGroup): string {
  return settingsGroupTemplate(group.title, group.iconSrc, renderOptions(group.options));
}

function renderGroups(groups: SettingsGroup[]): string {
  return groups.map((group) => renderGroup(group)).join("");
}

function getGroupInputName(group: SettingsGroup): string | null {
  return group.options[0]?.name ?? null;
}

function getCheckedInput(form: HTMLFormElement, inputName: string): HTMLInputElement | null {
  return form.querySelector<HTMLInputElement>(`input[name="${inputName}"]:checked`);
}

function getSelectedValue(form: HTMLFormElement, group: SettingsGroup): string | null {
  const inputName = getGroupInputName(group);
  return inputName ? getCheckedInput(form, inputName)?.value ?? null : null;
}

function findOptionLabel(group: SettingsGroup, value: string): string | null {
  const option = group.options.find((entry) => entry.value === value);
  return option?.label ?? null;
}

function getSelectedLabel(form: HTMLFormElement, group: SettingsGroup): string | null {
  const value = getSelectedValue(form, group);
  return value ? findOptionLabel(group, value) : null;
}

function isGroupSelected(form: HTMLFormElement, groupName: string): boolean {
  return Boolean(getCheckedInput(form, groupName));
}

function areAllSettingsSelected(form: HTMLFormElement): boolean {
  return REQUIRED_GROUP_NAMES.every((groupName) => isGroupSelected(form, groupName));
}

function separatorSource(isActive: boolean): string {
  return isActive ? CHOSEN_SEPARATOR_SRC : DEFAULT_SEPARATOR_SRC;
}

function createStep(text: string, isActive: boolean, hasSeparator: boolean): SettingsStepItem {
  if (!hasSeparator) {
    return { text, isActive };
  }

  return { text, isActive, separatorSrc: separatorSource(isActive), separatorActive: isActive };
}

function createStepFromGroup(form: HTMLFormElement, group: SettingsGroup, hasSeparator: boolean): SettingsStepItem {
  const label = getSelectedLabel(form, group);
  return createStep(label ?? group.stepLabel, Boolean(label), hasSeparator);
}

function buildStepItems(form: HTMLFormElement): SettingsStepItem[] {
  return settingsGroups.map((group, index) => {
    const hasSeparator = index < settingsGroups.length - 1;
    return createStepFromGroup(form, group, hasSeparator);
  });
}

function renderStep(item: SettingsStepItem): string {
  const stepMarkup = settingsStepTemplate(item.text, item.isActive);
  return item.separatorSrc
    ? `${stepMarkup}${settingsSeparatorTemplate(item.separatorSrc, Boolean(item.separatorActive))}`
    : stepMarkup;
}

function renderStepItems(stepItems: SettingsStepItem[]): string {
  return stepItems.map((item) => renderStep(item)).join("");
}

function getStepsMount(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-settings-steps]");
}

function renderSettingsSteps(form: HTMLFormElement): void {
  const stepsMount = getStepsMount();

  if (!stepsMount) {
    return;
  }

  const markup = renderStepItems(buildStepItems(form));
  stepsMount.innerHTML = settingsStepsTemplate(markup, areAllSettingsSelected(form));
}

function getPreviewImage(): HTMLImageElement | null {
  return document.querySelector<HTMLImageElement>(".settings__preview-card img");
}

function getThemePreview(themeValue: string): ThemePreview {
  return themePreviewByValue[themeValue] ?? themePreviewByValue[DEFAULT_THEME_VALUE];
}

function applyThemePreview(previewImage: HTMLImageElement, preview: ThemePreview): void {
  previewImage.src = preview.src;
  previewImage.alt = preview.alt;
}

function setThemePreview(themeValue: string): void {
  const previewImage = getPreviewImage();

  if (!previewImage) {
    return;
  }

  applyThemePreview(previewImage, getThemePreview(themeValue));
}

function getSelectedThemeValue(form: HTMLFormElement): string {
  return getCheckedInput(form, "theme")?.value ?? DEFAULT_THEME_VALUE;
}

function syncThemePreviewToSelection(form: HTMLFormElement): void {
  selectedThemeValue = getSelectedThemeValue(form);
  setThemePreview(selectedThemeValue);
}

function bindThemeHover(optionElement: HTMLElement, input: HTMLInputElement): void {
  optionElement.addEventListener("mouseenter", () => setThemePreview(input.value));
  optionElement.addEventListener("mouseleave", () => setThemePreview(selectedThemeValue));
}

function initThemePreviewHover(form: HTMLFormElement): void {
  const themeInputs = form.querySelectorAll<HTMLInputElement>('input[name="theme"]');

  themeInputs.forEach((input) => {
    const optionElement = input.closest<HTMLElement>(".settings__option");
    if (optionElement) {
      bindThemeHover(optionElement, input);
    }
  });
}

function onSettingsChange(form: HTMLFormElement): void {
  syncThemePreviewToSelection(form);
  renderSettingsSteps(form);
}

function renderForm(form: HTMLFormElement): void {
  form.innerHTML = renderGroups(settingsGroups);
}

function bindFormChange(form: HTMLFormElement): void {
  form.addEventListener("change", () => onSettingsChange(form));
}

function getStartButtonFromEvent(event: MouseEvent): HTMLButtonElement | null {
  if (!(event.target instanceof HTMLElement)) {
    return null;
  }

  return event.target.closest<HTMLButtonElement>(".settings__start-button");
}

function canStartGameNavigation(startButton: HTMLButtonElement | null, form: HTMLFormElement): boolean {
  if (!startButton || startButton.disabled) {
    return false;
  }

  return areAllSettingsSelected(form);
}

function onStartButtonClick(event: MouseEvent, form: HTMLFormElement): void {
  const startButton = getStartButtonFromEvent(event);
  if (!canStartGameNavigation(startButton, form)) {
    return;
  }

  navigateTo("game");
}

function bindStartNavigationClick(stepsMount: HTMLElement, form: HTMLFormElement): void {
  stepsMount.addEventListener("click", (event: MouseEvent) => onStartButtonClick(event, form));
}

function bindStartNavigation(form: HTMLFormElement): void {
  const stepsMount = getStepsMount();
  if (!stepsMount) {
    return;
  }

  bindStartNavigationClick(stepsMount, form);
}

function setupSettingsForm(form: HTMLFormElement): void {
  renderForm(form);
  initThemePreviewHover(form);
  onSettingsChange(form);
  bindFormChange(form);
  bindStartNavigation(form);
}

function getSettingsForm(): HTMLFormElement | null {
  return document.querySelector<HTMLFormElement>("[data-settings-form]");
}

function mountSettingsForm(): void {
  const settingsForm = getSettingsForm();
  if (settingsForm) {
    setupSettingsForm(settingsForm);
  }
}

mountSettingsForm();
