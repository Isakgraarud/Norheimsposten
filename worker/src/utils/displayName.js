export const getUserDisplayName = (user) => {
  const firstName = user.first_name || user.firstName || ''
  const lastName = user.last_name || user.lastName || ''
  const name = `${firstName} ${lastName}`.trim()
  if (name) return name
  if (user.email) return user.email
  return 'Ukjent bruker'
}
