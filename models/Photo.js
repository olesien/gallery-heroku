/**
 * Photo model
 */

module.exports = (bookshelf) => {
	return bookshelf.model(
		"Photo",
		{
			tableName: "photos",
			albums() {
				return this.belongsToMany("Album");
			},
		},
		{
			//user id and album id
			async fetchAlbums(userId, id, fetchOptions = {}) {
				return await new this({ id: userId, id: id }).fetch(
					fetchOptions
				);
			},
		}
	);
};
