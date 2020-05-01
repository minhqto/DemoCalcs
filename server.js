//using express to create server

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const calcs = require("./demoCalcs");
const jsdom = require("jsdom");
const $ = require("jquery")(new jsdom.JSDOM().window);
const bodyParser = require("body-parser");
const clientSessions = require("client-sessions");
const HTTP_PORT = process.env.PORT || 8080;
const monServ = require("./mongooseServ");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(
  clientSessions({
    cookieName: "session",
    secret: "demoCalculator2019",
    duration: 30 * 60 * 1000,
    activeDuration: 60 * 1000,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, ""); //activeRoute is assigned to / or ""
  next();
});

app.set("view engine", ".hbs");

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      isActive: function(url) {
        return app.locals.activeRoute == url ? "active" : "";
      },
      isActiveButton: function(url) {
        return app.locals.activeRoute == url ? "active bg-primary" : "";
      },
      shotType: function(url) {
        return app.locals.activeRoute == url ? true : false;
      },
      equalsZero: function(fl) {
        return fl == 0 ? true : false;
      },
      loggedIn: function() {},
    },
  })
);

function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.get("/", (req, res) => {
  res.render("home", {});
});

app.get("/timefuse", (req, res) => {
  res.render("timefuse", {
    type: "Select a shot type.",
  });
});

app.get("/timefuse/single", (req, res) => {
  res.render("timefuse", {
    type: "Single Shot",
  });
});

app.get("/timefuse/multi", (req, res) => {
  res.render("timefuse", {
    type: "Multi Shot",
  });
});

app.get("/steel", (req, res) => {
  res.render("steel");
});

app.get("/timber", (req, res) => {
  res.render("timber");
});

app.get("/concrete", (req, res) => {
  res.render("concrete");
});

app.get("/boreholes", (req, res) => {
  res.render("boreholes");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/timefuse/single", (req, res) => {
  if (!req.body.walktime || !req.body.burntime) {
    res.render("timefuse", {
      type: "Single Shot",
      error: "Missing parameters!",
    });
  } else {
    const fuseLen = calcs.timeFuseLenSingle(
      req.body.walktime,
      req.body.burntime
    );
    const tt = calcs.totalTime(fuseLen, req.body.burntime);
    res.render("timefuse", {
      wt: req.body.walktime,
      bt: req.body.burntime,
      fl: fuseLen,
      totalTime: tt,
    });
  }
});
//redo for multi

app.post("/timefuse/multi", (req, res) => {
  if (!req.body.walktime || !req.body.burntime) {
    res.render("timefuse", {
      type: "Multi Shot",
      error: "Missing parameters!",
    });
  } else {
    const fuseLen = calcs.timeFuseLenMulti(
      req.body.walktime,
      req.body.burntime
    );
    const tt = calcs.totalTime(fuseLen, req.body.burntime);
    res.render("timefuse", {
      wt: req.body.walktime,
      bt: req.body.burntime,
      fl: fuseLen,
      totalTime: tt,
    });
  }
});

app.get("/steel/bar", (req, res) => {
  res.render("steel", {
    type: "Steel Bar",
  });
});

app.get("/steel/cable", (req, res) => {
  res.render("steel", {
    type: "Steel Cable",
  });
});

app.post("/steel/bar", (req, res) => {
  if (req.body.circumference < 0) {
    res.render("steel", {
      error: "Circumference value below zero!",
    });
  } else if (req.body.circumference == 0) {
    res.render("steel", {
      error: "Circumference value equal to zero!",
    });
  } else if (req.body.circumference > 31.4) {
    res.render("steel", {
      error: "Circumference value greater than 31.4cm!",
    });
  } else {
    let C = calcs.steelBar(req.body.circumference);
    if (req.body.highSteel) {
      C *= 2.5;
    }
    let blks = calcs.convertBlocks(C);

    res.render("steel", {
      cValue: C,
      blksC4: blks,
    });
  }
});

app.post("/steel/cable", (req, res) => {
  if (req.body.circumference < 0) {
    res.render("steel", {
      error: "Circumference value below zero!",
    });
  } else if (req.body.circumference == 0) {
    res.render("steel", {
      error: "Circumference value equal to zero!",
    });
  } else if (req.body.circumference > 31.4) {
    res.render("steel", {
      error: "Circumference value greater than 31.4cm!",
    });
  } else {
    let C = calcs.steelCable(req.body.circumference);
    if (req.body.highSteel) {
      C *= 2.5;
    }
    let blks = calcs.convertBlocks(C);

    res.render("steel", {
      cValue: C,
      blksC4: blks,
    });
  }
});

app.post("/register", (req, res) => {
  //check that req.body.emailAddress is a forces email.
  //send a verification email to forces.gc.ca email address
  //password length/encrypt password
  //add email verification service
  if (req.body.password === req.body.password2) {
    monServ
      .createUser(req.body.userName, req.body.password, req.body.emailAddress)
      .then(() => {
        res.render("register", { successMessage: true });
      })
      .catch((err) => {
        if (err == 11000) {
          res.render("register", {
            errorMessage: "Username and/or email address are already in use!",
          });
        } else {
          res.render("register", {
            errorMessage: "An unknown error occurred",
          });
        }
      });
  } else {
    res.render("register", { errorMessage: "Passwords do not match!" });
  }
});

app.post("/login", (req, res) => {});
//404 error message
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/public/img/3bft8u.jpg"));
});

monServ
  .initialize()
  .then((msg) => {
    console.log(msg);
  })
  .then(() => {
    app.listen(HTTP_PORT, function() {
      console.log(`App listening on ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(HTTP_PORT, function() {
//   console.log(`App listening on ${HTTP_PORT}`);
// });
