// helpful functions for later, not yet implemented

export const unknownEndpoint = function(request, response) => {
  response.status(404).send({ error: 'unknown endpoint ' });
};

export const tokenExtractor = function(request, response, next) => {
  const authorization = request.get('authorization');
  request.token = null;

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }

  next();
};

export const userExtractor = async function(request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  // const user = await User.findById(decodedToken.id);

  request.user = user;

  next();
};
