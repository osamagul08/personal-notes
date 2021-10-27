const responseHelper = (res, status, statusCode, message= null, data= null, totalDoc = null) => {
  if (data != null) {
    if (totalDoc != null) {
      res.status(statusCode).json({
        status, message, totalDoc, result: data.length, data
      })   
    } else {
      res.status(statusCode).json({
        status, message, result: data.length, data
      })   
    }
   
  } else {
    res.status(statusCode).json({
      status, message
    }) 
  }
                                   
}
module.exports = responseHelper;