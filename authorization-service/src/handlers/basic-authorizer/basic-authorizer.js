const generatePolicy = (principalId, resource, effect) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    }
  }
});

export const basicAuthorizer = (event, context, cb) => {
  console.log('basic-authorizer-event', event);

  if (event.type !== 'TOKEN') cb('Unauthorized');

  try {
    const tokenParts = event.authorizationToken.split(' ');
    if (tokenParts[0] !== 'Basic') cb('Unauthorized');

    const [username, password] = Buffer.from(tokenParts[1], 'base64')
      .toString('utf-8')
      .split(':');

    console.log(username, password);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password
      ? 'Deny'
      : 'Allow';

    const policy = generatePolicy(username, event.methodArn, effect);

    console.log(policy);

    cb(null, policy);
  } catch (err) {
      console.log('error', err);
      cb('Unauthorized');
  }
};
