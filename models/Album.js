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
			async fetchPhotos(user_id, id, fetchOptions = {}) {
				return await new this({ user_id, id }).fetch(fetchOptions);
				s;
			},
		}
	);
};
