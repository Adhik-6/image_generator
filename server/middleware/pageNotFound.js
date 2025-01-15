const pageNotFound = (req, res) => {
  console.log("page not found")
  res.status(404).send("404 | PAGE NOT FOUND")
}

export default pageNotFound