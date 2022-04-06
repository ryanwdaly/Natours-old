//const fs = require('fs');
const Tour = require('./../models/tourModel');

//exports.checkID = (req, res, next, val) => {
//  console.log(`Tour id is: ${val}`);
//  if (req.params.id * 1 > tourList.length) {
//    return res.status(404).json({
//      status: 'fail',
//      message: 'Invalid ID',
//    });
//  }
//  next();
//};
//
//exports.checkBody = (req, res, next) => {
//  if (!req.body.name || !req.body.price) {
//    return res.status(400).json({
//      status: 'fail',
//      message: 'no name and/or pice',
//    });
//  }
//  next();
//};

////////////////////////ROUTE HANDLERS///////////////////////////////
// VIEW ALL TOURS
exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = {...req.query}; //restucture so req.query does not change
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query =  Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields)
    } else {
      query = query.select('-__v');
    }
    
    // EXECUTE QUERY
    const tours = await query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

////////////////////////////////////////////////////////////////////
// VIEW SPECIFIC TOUR BY ID
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: `success`,
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  //  const tour = tourList.find((el) => el.id === id);
  //
  //  res.status(200).json({
  //    status: `success`,
  //    data: {
  //      tour: tour,
  //    },
  //  });
};

////////////////////////////////////////////////////////////////////
// ADD A TOUR BY UPDATING ALL
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent!',
    });
  }
};

////////////////////////////////////////////////////////////////////
// UPDATING WITH PATCH
exports.updateTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour  
      }
    });
  } catch(err) {
      res.status(400).json({
        status: 'fail',
        message: 'invalid data sent!'
      })
    }
};

////////////////////////////////////////////////////////////////////
// DELETE
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent!'
    })
  }
};
/////////////////////////////////////////////////////////////////////
