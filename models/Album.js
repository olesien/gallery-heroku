/**
 * Photo model
 */

module.exports = (bookshelf) => {
	return bookshelf.model(
		"Album",
		{
			tableName: "albums",
			photos() {
				return this.belongsToMany("Photo");
			},
		},
		{
			//user id and album id
			async fetchPhotos(userId, id, fetchOptions = {}) {
				return await new this({ id: userId, id: id }).fetch(
					fetchOptions
				);s
			},
		}
	);
};
