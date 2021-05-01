const randomValueBetweenValues = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getNumberOfPolesForStreetLength = streetLength => {
  return streetLength / 50;
};

const buildPoleId = (poleIndex, streetName) => {
  return streetName.split(' ').map(word => word[0]).join('') + '-' + poleIndex;
};

module.exports = {
  randomValueBetweenValues,
  getNumberOfPolesForStreetLength,
  buildPoleId
};
