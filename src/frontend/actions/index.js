export const logOut = username => {
  return {
    type: 'LOG_OUT',
    username
  }
}

export const saveInvoice = inv => {
  return {
    type: 'SAVE_INV',
    inv
  }
}
