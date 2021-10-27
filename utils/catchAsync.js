module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next)//this catch(next) function send to globale error middleware
    }
}