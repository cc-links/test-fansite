export enum HooksItemsType {
  MY_HOOKS = 'myHooks',
  TEMPLATE_HOOKS = 'templateHooks',
}

export interface HooksItem {
  id: string
  message: string
  hookName: string
  name: string
  price: string
  shelfStatus: number
  exposedCnt: number
  vaults: HooksItemVaults[]
}

export interface HooksItemVaults {
  vaultId: string
  type: string
  thumbUrl: string
}

export interface TemplateHooksItem {
  templateId: string
  templateType: number
  message: string
  hookName: string
  price: string
  coverImg: string
}

export interface HookFormType {
  name: string
  message: string
  vaults?: HooksItemVaults[]
  price?: string
  shelfStatus?: number
  exposedCnt?: number
}

export interface AddVaultType {
  isChooseAddMedia: boolean
  isChooseAddPrice: boolean
  media: HooksItemVaults[]
  price: string
}

export enum EditHookMode {
  CREATE_BY_TEMPLATE_HOOKS = 'editTemplateHooks',
  CREATE_BY_EMPTY = 'createByEmpty',
  EDIT_HOOKS = 'editHooks',
  VIEW = 'view',
  SHARE = 'share',
}

export interface EditHooksState {
  mode: EditHookMode
  visible: boolean
  id?: string
  templateId?: string
  item?: HooksItem & TemplateHooksItem
}

export enum ShelfStatusEnum {
  normal = 1,
  down,
}
