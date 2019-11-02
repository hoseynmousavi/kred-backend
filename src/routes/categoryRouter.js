import categoryController from "../controllers/categoryController"

const categoryRouter = (app) =>
{
    app.route("/category")
        .get(categoryController.getCategories)

    app.route("/category/:categoryId")
        .get(categoryController.getCategoryById)
}

export default categoryRouter