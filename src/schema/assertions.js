class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.field = field;
  }
}

export const assertValidUser = user => {
  try {
    if (!user && !user._id) throw new Error();
  } catch (error) {
    throw new Error('Access denied');
  }
};

export const assertValidPolishInput = data => {
  try {
    if (!data) throw new Error('Access denied');
  } catch (error) {
    throw new ValidationError('Link validation error: invalid url.', 'url');
  }
};

export const assertValidPolishId = async (id, Polishes) => {
  try {
    const _polish = await Polishes.find({ _id: id }, { _id: 1 }).limit(1);
    if (!_polish) throw new Error();
  } catch (error) {
    throw new Error('Wrong polish ID');
  }
};
