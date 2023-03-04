import path from 'path'

export function routeTypeDetector(filePath) {
  return (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next()
      return
    }

    return res.sendFile(path.join(filePath, 'build', 'index.html'))
  }
}
