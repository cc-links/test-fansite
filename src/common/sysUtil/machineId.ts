import { nanoid } from 'nanoid'

const MACHINE_ID_KEY = 'LINKS-MACHINE-ID'

export function getMachineId() {
  const machineId = localStorage.getItem(MACHINE_ID_KEY)
  if (machineId) return machineId

  const newMachineId = `${nanoid()}::${Date.now()}`
  localStorage.setItem(MACHINE_ID_KEY, newMachineId)
  return newMachineId
}
