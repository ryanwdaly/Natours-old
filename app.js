const fs = require("fs");
const express = require("express");
const port = 3000;

const app = express();

// MIDDLEWARE
app.use(express.json());

const tourList = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

////////////////////////////////////////////////////////////////////
// VIEW ALL TOURS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tourList.length,
    data: {
      tours,
    },
  });
};
app.get("/api/v1/tours", getAllTours);

////////////////////////////////////////////////////////////////////
// VIEW SPECIFIC TOUR BY ID
const getTour = (req, res) => {
  console.log(req.params);

  // * 1 turns string into int
  const id = req.params.id * 1;
  const tour = tourList.find((el) => el.id === id);

  // Error if tours does not exist
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: `success`,
    data: {
      tour: tour,
    },
  });
};

app.get("/api/v1/tours/:id", getTour);

////////////////////////////////////////////////////////////////////
// ADD A TOUR BY UPDATING ALL
const createTour = (req, res) => {
  const newId = tourList[tourList.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tourList.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tourList),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
  res.send("done");
}
app.post(`/api/v1/tours`, createTour)

////////////////////////////////////////////////////////////////////
// UPDATING WITH PATCH
app.patch(`/api/v1/tours/:id`, (req, res) => {
  if (req.params.id * 1 > tourList.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>",
    },
  });
});

////////////////////////////////////////////////////////////////////
// DELETE
app.delete(`/api/v1/tours/:id`, (req, res) => {
  if (req.params.id * 1 > tourList.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
