const bcrypt = require("bcrypt");
const { User, Models, Recruiter } = require("../models/index");
const {
  sendConfirmationMail,
  sendPasswordResetMail,
} = require("../utils/sendmail");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.CLIENTID);


const register = async (req, res) => {
  const { full_name, role } = req.body;
  const email = req.body.email.toLowerCase();
  const password = req.body.password.toLowerCase();
  const confirm_password = req.body.confirm_password.toLowerCase();

  try {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) return res.status(400).send("Email already exists");

    //compare password
    if (password !== confirm_password)
      return res.status(400).send("Passwords do not match");

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create confirmation code with email token
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY);

    const arr = full_name.split(" ");
    const first_name = arr[0];

    //send comfirmation mail
    sendConfirmationMail(email, first_name, token);

    //save to database
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role,
      confirmation_code: token,
    });

    return res
      .status(200)
      .send("A confirmation mail has been sent to your email");
  } catch (err) {
    return res.status(400).send(err);
  }
};

const confirmation = async (req, res) => {
  try {
    let confirmation_code = req.params.token;
    let user = await User.findOne({ where: { confirmation_code } });
    if (!user) return res.status(400).send("User Not found");

    //if user exist, change verified to true
    const status = await User.update(
      { verified: true },
      { where: { confirmation_code } }
    );
    res.redirect("http://localhost:3000/login");
    // return res.send('account verified')
  } catch (err) {
    return res.status(400).send(err);
  }
};

const signin = async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password.toLowerCase();

  try {
    //check if email exists
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).send("user does not exist, please signup");

    //check if password is correct
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json("Invalid password");

    //check if user is confirmed/verified
    if (user.verified == false)
      return res.json("Please check your email to verify your account");

    //check if user has filled form and created account
    let hasAccount = true;

    if (user.role == "model") {
      const model = await Models.findOne({ where: { userId: user.id } });
      if (!model) hasAccount = false;
    } else {
      const recruiter = await Recruiter.findOne({ where: { userId: user.id } });
      if (!recruiter) hasAccount = false;
    }
    console.log(hasAccount);

    //assign jwt token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

    res
      .status(200)
      .json({ token, role: user.role, isFullySignedUp: hasAccount });
  } catch (err) {
    return res.status(400).send(err);
  }
};

const forget_password = async (req, res) => {
  const email = req.body.email.toLowerCase();

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send("Account does not exist");

    //create a one-time link valid for 10 minutes
    const secret = user.password + process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "10m" });

    const arr = user.full_name.split(" ");
    const first_name = arr[0];

    //send password reset link
    sendPasswordResetMail(email, first_name, user.id, token, res);
    return res
      .status(200)
      .send("A one-time password link has been sent to your email.");
  } catch (err) {
    return res.status(400).send(err);
  }
};

const reset_password = async (req, res) => {
  const password = req.body.password.toLowerCase();
  const confirm_password = req.body.confirm_password.toLowerCase();
  const id = req.query.id;
  const token = req.query.token;

  try {
    //check if user exists
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json("Invalid user");

    //verify the token received
    const secret = user.password + process.env.JWT_SECRET_KEY;
    const payload = jwt.verify(token, secret);

    //compare passwords sent
    if (password !== confirm_password)
      return res.status(400).send("Password does not match");

    //encrpyt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //insert new password into database
    const updatedPass = await User.update(
      { password: hashedPassword },
      { where: { id } }
    );
    res.status(200).send("password changed successfully");
  } catch (error) {
    return res.status(400).send(error);
  }
};

const google_signup = async (req, res) => {
  const { tokenId, role } = req.body;

  try {
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENTID,
    });
    const { name, email, email_verified } = response.payload;

    //check if email exists
    const user = await User.findOne({ where: { email } });
    if (user) {
      //assign jwt token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
      res.status(200).json({ token, role: user.role });
    }

    //save to database
    let password = email + process.env.JWT_SECRET_KEY;
    const newUser = await User.create({
      full_name: name,
      email,
      password,
      role,
      verified: email_verified,
    });

    //assign jwt token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY);
    res.status(200).json({ token, role: newUser.role });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports = {
  register,
  confirmation,
  signin,
  forget_password,
  reset_password,
  google_signup,
};
