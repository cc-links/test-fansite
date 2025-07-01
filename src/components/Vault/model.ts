import { create } from 'zustand'

interface VaultModel {
  search: string
}

const defaultVaultModel: () => VaultModel = () => ({
  search: '',
})

export const useVaultModel = create<VaultModel>(() => defaultVaultModel())

export const initVaultModel = () => {
  useVaultModel.setState(defaultVaultModel())
}

export const setActiveContactId = () => {
  useVaultModel.setState({})
}
