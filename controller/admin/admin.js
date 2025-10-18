import User from "../../models/userSchema.js" //yaha schema aye ga

const getDataByAdmin = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    const err = new Error("error getting data")
    err.statusCode = 500
    throw err
  }
}

const createDataByAdmin = async (req, res) => {
  try {
    const {a, b, c} = req.body
    const data = { a, b , c}
    const newUser = new User(data)
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    const err = new Error("error creating data")
    err.statusCode = 500
    throw err
  }
}


const updateDataByAdmin = async (req, res) => {
  try {
    const id = req.params.id
    const {a, b, c} = req.body
    const data = { a, b , c}
    const updatedUser = await User.findOneAndUpdate(
      { id },
       data,
      { new: true }
    )
    if (!updatedUser) {
      const err = new Error("data not found")
      err.statusCode = 400
      throw err
    }
    res.status(200).json(updatedUser)
  } catch (error) {
    const err = new Error("error update user data")
    err.statusCode = 500
    throw err
  }
}

const modifyDataByAdmin = async (req, res) => {
  try {
    const id = req.params.id
    const {a, b, c} = req.body
    const data = { a, b , c}
    const modifiedUser = await User.findOneAndReplace(
      { id },
      data,
      { new: true }
    )
    if (!modifiedUser) {
      const err = new Error("data not found")
      err.statusCode = 400
      throw err
    }
    res.status(200).json(modifiedUser);
  } catch (error) {
    const err = new Error("error modifying user data")
    err.statusCode = 500
    throw err
  }
}

const deleteDataByAdmin = async (req, res) => {
  try {
    const id = req.params.id
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      const err = new Error("data not found")
      err.statusCode = 400
      throw err
    }
    res.status(200).json({ message: "deleted successfully" })
  } catch (error) {
    const err = new Error("error deleting data")
    err.statusCode = 500
    throw err
  }
}

export  {
  getDataByAdmin,  
createDataByAdmin,
updateDataByAdmin,
modifyDataByAdmin,
deleteDataByAdmin,
}
