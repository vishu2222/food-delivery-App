const baseUrl = 'http://localhost:3000'

export async function getRestaurants() {
  const res = await fetch(`${baseUrl}/restaurants`)
  const data = await res.json()
  return data.restaurants
}

export async function getMenu(id) {
  const res = await fetch(`${baseUrl}/restaurants/${id}/menu`)
  const data = await res.json()
  return data.menu
}
