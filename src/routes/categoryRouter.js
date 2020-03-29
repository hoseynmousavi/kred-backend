import categoryController from "../controllers/categoryController"

const categoryRouter = (app) =>
{
    app.route("/category")
        .get(categoryController.getCategories)

    app.route("/category/:category_id")
        .get(categoryController.getCategoryById)
}

export default categoryRouter