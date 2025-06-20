const User = require("../models/User");
const bcrypt = require("bcrypt")

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({message: "User already exists"})

        const user = await User.create({name, email, password, role});

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const isExist = await User.findOne({email});
        if (!isExist) return res.status(400).send("User not found");

        const isMatch = await bcrypt.compare(password, isExist.password);

        if (!isMatch) return res.status(400).send("Incorrect password");

        res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: isExist._id,
                name: isExist.name,
                email: isExist.email,
                role: isExist.role
            },
        });
    } catch (error) {
        res.status(500).send(err.message);
    }
}