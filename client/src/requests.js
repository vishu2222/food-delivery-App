const url = 'http://localhost:3000'

export async function getRestaurants() {
  const res = await fetch(url + '/restaurants')
  const data = await res.json()
  return data.restaurants
}

export async function getMenu(id) {
  const res = await fetch(url + '/restaurants/' + id)
  const data = await res.json()
  return data.menu
}
