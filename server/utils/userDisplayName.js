export const composeUserDisplayName = (user = {}) => {
  const firstName = typeof user.firstName === 'string' ? user.firstName.trim() : ''
  const lastName = typeof user.lastName === 'string' ? user.lastName.trim() : ''

  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ')
  }

  if (typeof user.email === 'string' && user.email.trim()) {
    return user.email.trim()
  }

  return 'Ukjent bruker'
}