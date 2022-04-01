const fs = require('fs');

const tourList = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tourList.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'no name and/or pice',
    });
  }
  next();
};

////////////////////////ROUTE HANDLERS///////////////////////////////
// VIEW ALL TOURS
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tourList.length,
    data: {
      tourList,
    },
  });
};

////////////////////////////////////////////////////////////////////
// VIEW SPECIFIC TOUR BY ID
exports.getTour = (req, res) => {
  console.log(req.params);

  // * 1 turns string into int
  const id = req.params.id * 1;
  const tour = tourList.find((el) => el.id === id);

  res.status(200).json({
    status: `success`,
    data: {
      tour: tour,
    },
  });
};

////////////////////////////////////////////////////////////////////
// ADD A TOUR BY UPDATING ALL
exports.createTour = (req, res) => {
  const newId = tourList[tourList.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tourList.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tourList),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  res.send('done');
};

////////////////////////////////////////////////////////////////////
// UPDATING WITH PATCH
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

////////////////////////////////////////////////////////////////////
// DELETE
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
/////////////////////////////////////////////////////////////////////
