export function getCategoryRoute(category) {
  if (!category) {
    return null
  }

  switch (category) {
    case 'Home':
      return '/'
    case 'News':
      return '/news'
    case 'Memes':
      return '/memes'
    case 'About Us':
      return '/about'
    case 'Games':
      return '/games'
    default:
      return null
  }
}