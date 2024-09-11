const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	description: String,
	image: {
		url: String,
		filename: String,
	},
	price: Number,
	location: String,
	country: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	geometry: {
		type: {
			type: String,
			enum: ["Point"],
			// required: true,
		},
		coordinates: {
			type: [Number],
			// required: true,
		},
	},
	category: {
		type: [String],
	},
});

listingSchema.post("findOneAndDelete", async (listing) => {
	if (listing) {
		await Review.deleteMany({ _id: { $in: listing.reviews } });
	}
});


listingSchema.pre(
	"deleteMany",
	{ document: false, query: true },
	async function () {
		const listings = await this.model.find(this.getFilter());
		const reviewIds = listings.flatMap((listing) => listing.reviews);
		await Review.deleteMany({ _id: { $in: reviewIds } });
	}
);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;