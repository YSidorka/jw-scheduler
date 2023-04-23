class DataOutputDto {
  constructor(obj) {
    this.id = obj._id;
    this.type = obj.type;
    this.data = obj.data;
  }
}

module.exports = DataOutputDto;
