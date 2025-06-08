const { Router } = require("express");
const router = Router();

// Http methods: Get Post Put Delete

router.get("/", (req, res) => {
    res.send("Login Page")
});

router.post("/", (req, res) => {
    res.send("Login Page")
});

module.exports = router;